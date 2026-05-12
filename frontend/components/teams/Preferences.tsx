"use client";

import { useState } from "react";

type ToggleProps = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
};

function Toggle({ enabled, setEnabled }: ToggleProps) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}

export default function Preferences() {
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [focusAlert, setFocusAlert] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [muteFocus, setMuteFocus] = useState(true);
  const [theme, setTheme] = useState("Light");

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-5">

      {/* TITLE */}
      <div>
        <h2 className="text-lg font-semibold">
          Preferences
        </h2>

        <p className="text-sm text-gray-500">
          Customize your experience
        </p>
      </div>

      {/* SETTINGS */}
      <div className="space-y-5">

        {/* Desktop Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Desktop Notifications
            </p>

            <p className="text-sm text-gray-500">
              Show desktop notifications
            </p>
          </div>

          <Toggle
            enabled={desktopNotif}
            setEnabled={setDesktopNotif}
          />
        </div>

        {/* Team Visibility */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Team Visibility
            </p>

            <p className="text-sm text-gray-500">
              Show my status to team
            </p>
          </div>

          <Toggle
            enabled={showStatus}
            setEnabled={setShowStatus}
          />
        </div>

        {/* Focus Alert */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Focus Session Alert
            </p>

            <p className="text-sm text-gray-500">
              Notify when team enters focus mode
            </p>
          </div>

          <Toggle
            enabled={focusAlert}
            setEnabled={setFocusAlert}
          />
        </div>

        {/* Weekly Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Weekly Summary Email
            </p>

            <p className="text-sm text-gray-500">
              Receive weekly productivity summary
            </p>
          </div>

          <Toggle
            enabled={weeklySummary}
            setEnabled={setWeeklySummary}
          />
        </div>

        {/* Auto Mute */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Auto Mute Notifications
            </p>

            <p className="text-sm text-gray-500">
              Mute notifications while focusing
            </p>
          </div>

          <Toggle
            enabled={muteFocus}
            setEnabled={setMuteFocus}
          />
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Theme Mode
            </p>

            <p className="text-sm text-gray-500">
              Customize application appearance
            </p>
          </div>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>

      </div>
    </div>
  );
}