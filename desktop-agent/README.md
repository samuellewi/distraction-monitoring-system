# Desktop Agent

Minimal macOS and Windows desktop tracking agent for the distraction monitoring system.

The agent polls the active app/window every 5 seconds. It keeps one in-memory session for the current app/window and posts that session to the backend when the active app/window changes or when the process is stopped with `Ctrl+C`.

Unknown detected apps are automatically added to App Classification as `NEUTRAL`. Users can later open App Classification and reclassify discovered apps as `PRODUCTIVE` or `DISTRACTING`.

## Requirements

- macOS or Windows
- Node.js 20 or newer
- Backend running at `http://127.0.0.1:4000`
- A valid JWT from the frontend login flow

macOS uses `osascript` and `System Events` to read the frontmost app/window. macOS may ask for Accessibility or Automation permission for Terminal, iTerm, VS Code, or whichever app runs the agent.

Windows uses PowerShell and Win32 APIs to read the foreground window and owning process. Some systems may require PowerShell execution access depending on local policy.

Unsupported platforms exit with:

```text
Desktop tracking is currently supported only on macOS and Windows.
```

## Run

1. Start the backend.
2. Start the frontend and log in.
3. Open browser dev tools and copy `authToken` from `localStorage`.
4. Run the agent with `AUTH_TOKEN`.

macOS or Linux-style shell:

```sh
cd desktop-agent
AUTH_TOKEN="<JWT token>" npm run dev
```

Windows PowerShell:

```powershell
cd desktop-agent
$env:AUTH_TOKEN = "<JWT token>"
npm run dev
```

Optional environment variables:

```sh
API_BASE_URL="http://127.0.0.1:4000/api"
POLL_INTERVAL_MS=5000
MIN_SESSION_SECONDS=5
AUTH_TOKEN="<JWT token>" npm start
```

## App Classification

The agent fetches app classifications from `GET /api/categories`. If the detected app name matches a category `name` case-insensitively, the posted activity includes that `categoryId`.

If the detected app is not classified yet, the agent calls `POST /api/categories` with:

```json
{
  "name": "Detected App Name",
  "type": "NEUTRAL"
}
```

The new category is cached locally and used for the activity. Empty app names and `Unknown` are not auto-created if avoidable.

Detected OS app names may differ from user-facing app names. For example:

- VS Code may appear as `Code`.
- Chrome may appear as `Google Chrome` on macOS or `chrome` on Windows.

Open App Classification after running the agent and reclassify discovered neutral apps as needed.

## Manual Test

1. Run backend and frontend.
2. Log in and copy `authToken` from `localStorage`.
3. Run the agent with `AUTH_TOKEN`.
4. Switch between apps and leave each app active for at least 5 seconds.
5. Stop the agent with `Ctrl+C` to flush the current session.
6. Open App Classification and confirm newly discovered apps appear as `NEUTRAL`.
7. Refresh `/tracker`, `/dashboard`, or `/report` and confirm activity records appear.

## Troubleshooting

- macOS permission errors: grant Accessibility or Automation permission to the terminal app running the agent, then restart the agent.
- Windows PowerShell detection errors: confirm PowerShell can run and that local policy allows the command used by the agent.
- `401` or `403` auth errors: log in again, copy a fresh `authToken` from `localStorage`, and restart the agent.
- Neutral activities: open App Classification and reclassify apps that were automatically discovered as `NEUTRAL`.
