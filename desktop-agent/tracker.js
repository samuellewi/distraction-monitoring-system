const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:4000/api";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 5000);
const MIN_SESSION_SECONDS = Number(process.env.MIN_SESSION_SECONDS || 5);
const CATEGORY_REFRESH_MS = Number(process.env.CATEGORY_REFRESH_MS || 60000);

const appleScript = `
tell application "System Events"
  set frontAppProcess to first application process whose frontmost is true
  set frontAppName to name of frontAppProcess
  try
    set frontWindowName to name of front window of frontAppProcess
  on error
    set frontWindowName to ""
  end try
end tell
return frontAppName & linefeed & frontWindowName
`;

const windowsPowerShellScript = `
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;

public class ActiveWindow {
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();

  [DllImport("user32.dll", SetLastError = true)]
  public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

  [DllImport("user32.dll")]
  public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
"@

$handle = [ActiveWindow]::GetForegroundWindow()
if ($handle -eq [IntPtr]::Zero) {
  throw "No foreground window found."
}

$titleBuilder = New-Object System.Text.StringBuilder 1024
[void][ActiveWindow]::GetWindowText($handle, $titleBuilder, $titleBuilder.Capacity)

$processId = 0
[void][ActiveWindow]::GetWindowThreadProcessId($handle, [ref]$processId)
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue

$appName = "Unknown"
if ($process -and -not [string]::IsNullOrWhiteSpace($process.ProcessName)) {
  $appName = $process.ProcessName.Trim()
}

if ($appName.EndsWith(".exe", [System.StringComparison]::OrdinalIgnoreCase)) {
  $appName = $appName.Substring(0, $appName.Length - 4)
}

$windowTitle = $titleBuilder.ToString().Trim()
if ([string]::IsNullOrWhiteSpace($windowTitle)) {
  $windowTitle = $appName
}

[pscustomobject]@{
  appName = $appName
  windowTitle = $windowTitle
} | ConvertTo-Json -Compress
`;

let categories = [];
let lastCategoryFetchAt = 0;
let activeSession = null;
let pollTimer = null;
let isPolling = false;
let isShuttingDown = false;

function log(message) {
  console.log(`[desktop-agent] ${message}`);
}

function logError(message, error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[desktop-agent] ${message}: ${detail}`);
}

function isMacPermissionError(error) {
  const detail = error instanceof Error ? error.message : String(error);
  return detail.includes("-10827") || detail.includes("-1743") || detail.includes("not authorized");
}

function isWindowsDetectionError(error) {
  const detail = error instanceof Error ? error.message : String(error);
  return detail.toLowerCase().includes("powershell") || detail.includes("user32.dll");
}

function ensureConfig() {
  if (!["darwin", "win32"].includes(process.platform)) {
    throw new Error("Desktop tracking is currently supported only on macOS and Windows.");
  }

  if (!AUTH_TOKEN) {
    throw new Error("AUTH_TOKEN is required. Copy authToken from browser localStorage after logging in.");
  }

  if (!Number.isFinite(POLL_INTERVAL_MS) || POLL_INTERVAL_MS < 1000) {
    throw new Error("POLL_INTERVAL_MS must be a number >= 1000.");
  }

  if (!Number.isFinite(MIN_SESSION_SECONDS) || MIN_SESSION_SECONDS < 0) {
    throw new Error("MIN_SESSION_SECONDS must be a number >= 0.");
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const text = await response.text();
  let result = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: false, error: { message: text } };
    }
  }

  if (!response.ok || result?.success === false) {
    const message = result?.error?.message || response.statusText || "Request failed";
    throw new Error(`${response.status} ${message}`);
  }

  return result?.data;
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function findCategoryForApp(appName) {
  const normalizedAppName = normalizeName(appName);

  if (!normalizedAppName) {
    return null;
  }

  return categories.find((category) => normalizeName(category.name) === normalizedAppName) || null;
}

function canCreateCategoryForApp(appName) {
  const normalizedAppName = normalizeName(appName);
  return Boolean(normalizedAppName && normalizedAppName !== "unknown");
}

async function refreshCategories({ force = false } = {}) {
  const now = Date.now();

  if (!force && now - lastCategoryFetchAt < CATEGORY_REFRESH_MS) {
    return;
  }

  try {
    const data = await request("/categories");
    categories = Array.isArray(data) ? data : [];
    lastCategoryFetchAt = now;
    log(`loaded ${categories.length} app classification${categories.length === 1 ? "" : "s"}`);
  } catch (error) {
    logError("failed to fetch categories", error);
  }
}

async function createNeutralCategory(appName) {
  const created = await request("/categories", {
    method: "POST",
    body: JSON.stringify({
      name: appName,
      type: "NEUTRAL"
    })
  });

  categories = [...categories.filter((category) => normalizeName(category.name) !== normalizeName(appName)), created];
  lastCategoryFetchAt = Date.now();
  log(`auto-created NEUTRAL app classification for ${created.name}`);
  return created;
}

async function getOrCreateCategoryForApp(appName) {
  const existingCategory = findCategoryForApp(appName);

  if (existingCategory || !canCreateCategoryForApp(appName)) {
    return existingCategory;
  }

  try {
    return await createNeutralCategory(appName);
  } catch (error) {
    logError(`failed to auto-create app classification for ${appName}`, error);
    await refreshCategories({ force: true });
    return findCategoryForApp(appName);
  }
}

async function getMacActiveWindow() {
  const { stdout } = await execFileAsync("osascript", ["-e", appleScript], {
    timeout: 3000,
    maxBuffer: 1024 * 32
  });

  const [appNameLine, ...windowTitleLines] = stdout.trimEnd().split(/\r?\n/);
  const appName = (appNameLine || "Unknown").trim();
  const windowTitle = windowTitleLines.join("\n").trim() || appName;

  return { appName, windowTitle };
}

async function getWindowsActiveWindow() {
  const { stdout } = await execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", windowsPowerShellScript],
    {
      timeout: 5000,
      maxBuffer: 1024 * 64,
      windowsHide: true
    }
  );

  const activeWindow = JSON.parse(stdout.trim());
  const appName = String(activeWindow.appName || "Unknown").trim();
  const windowTitle = String(activeWindow.windowTitle || appName).trim() || appName;

  return { appName, windowTitle };
}

async function getActiveWindow() {
  if (process.platform === "darwin") {
    return getMacActiveWindow();
  }

  if (process.platform === "win32") {
    return getWindowsActiveWindow();
  }

  throw new Error("Desktop tracking is currently supported only on macOS and Windows.");
}

function isSameWindow(left, right) {
  return left.appName === right.appName && left.windowTitle === right.windowTitle;
}

function createSession(activeWindow, startedAt = new Date()) {
  return {
    appName: activeWindow.appName,
    windowTitle: activeWindow.windowTitle,
    startedAt
  };
}

async function sendActivity(session, endedAt = new Date()) {
  const durationSeconds = Math.max(0, Math.round((endedAt.getTime() - session.startedAt.getTime()) / 1000));

  if (durationSeconds < MIN_SESSION_SECONDS) {
    log(`skipped short session ${session.appName} (${durationSeconds}s)`);
    return;
  }

  await refreshCategories();

  const category = await getOrCreateCategoryForApp(session.appName);
  const body = {
    appName: session.appName,
    windowTitle: session.windowTitle,
    startedAt: session.startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    durationSeconds,
    categoryId: category ? category.id : null
  };

  await request("/activities", {
    method: "POST",
    body: JSON.stringify(body)
  });

  const categoryText = category ? `, category=${category.name}` : "";
  log(`sent activity ${session.appName} (${durationSeconds}s${categoryText})`);
}

async function flushActiveSession(reason) {
  if (!activeSession) {
    return;
  }

  const session = activeSession;
  activeSession = null;

  try {
    await sendActivity(session);
  } catch (error) {
    logError(`failed to send activity during ${reason}`, error);
  }
}

async function pollActiveWindow() {
  if (isPolling || isShuttingDown) {
    return;
  }

  isPolling = true;

  try {
    await refreshCategories();

    const detectedAt = new Date();
    const activeWindow = await getActiveWindow();
    log(`active: ${activeWindow.appName} - ${activeWindow.windowTitle}`);

    if (!activeSession) {
      activeSession = createSession(activeWindow, detectedAt);
      return;
    }

    if (isSameWindow(activeSession, activeWindow)) {
      return;
    }

    const previousSession = activeSession;
    activeSession = createSession(activeWindow, detectedAt);

    try {
      await sendActivity(previousSession, detectedAt);
    } catch (error) {
      logError("failed to send activity", error);
    }
  } catch (error) {
    logError("failed to detect active window", error);
    if (isMacPermissionError(error)) {
      log(
        "grant Accessibility/Automation permission to the terminal app running this process, then restart the agent"
      );
    } else if (process.platform === "win32" && isWindowsDetectionError(error)) {
      log("PowerShell foreground-window detection failed; check that PowerShell can run on this system");
    }
  } finally {
    isPolling = false;
  }
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  if (pollTimer) {
    clearInterval(pollTimer);
  }

  log(`received ${signal}; flushing current session`);
  await flushActiveSession("shutdown");
  process.exit(0);
}

async function start() {
  ensureConfig();
  log(`starting; backend=${API_BASE_URL}, interval=${POLL_INTERVAL_MS}ms`);
  await refreshCategories({ force: true });
  await pollActiveWindow();
  pollTimer = setInterval(pollActiveWindow, POLL_INTERVAL_MS);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("uncaughtException", (error) => {
  logError("uncaught exception", error);
  void shutdown("uncaughtException");
});

process.on("unhandledRejection", (error) => {
  logError("unhandled rejection", error);
  void shutdown("unhandledRejection");
});

void start().catch((error) => {
  logError("startup failed", error);
  process.exit(1);
});
