"use client";

import { useState } from "react";

const initialApps = [
  { name: "VSCode", productive: true },
  { name: "YouTube", productive: false },
  { name: "Instagram", productive: false },
  { name: "Notion", productive: true },
];

export default function CategoriesPage() {
  const [apps, setApps] = useState(initialApps);
  const [newApp, setNewApp] = useState("");

  const productiveCount = apps.filter(app => app.productive).length;
  const distractingCount = apps.filter(app => !app.productive).length;

  const toggleApp = (index: number) => {
    const updated = [...apps];
    updated[index].productive = !updated[index].productive;
    setApps(updated);
  };

  return (
    <div className="p-6 space-y-6">

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search app..."
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
            className="border rounded-lg px-4 py-3 outline-none flex-1"

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!newApp.trim()) return;

                setApps([
                  ...apps,
                  {
                    name: newApp,
                    productive: false,
                  },
                ]);

                setNewApp("");
              }
            }}
          />

          <button
            onClick={() => {
              if (!newApp.trim()) return;

              setApps([
                ...apps,
                {
                  name: newApp,
                  productive: false,
                },
              ]);

              setNewApp("");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            + Add App
          </button>
        </div>

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">App Classification</h1>
        <p className="text-sm text-gray-500">
          Choose which apps are productive or distracting
        </p>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-xl border p-4 space-y-3">
        {apps.map((app, index) => (
          <div
            key={app.name}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <span className="font-medium">{app.name}</span>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  app.productive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {app.productive ? "Productive" : "Distracting"}
              </span>

              <button
                onClick={() => toggleApp(index)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  app.productive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                    app.productive ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-5 rounded-xl border">
        <h2 className="font-semibold mb-3">Summary</h2>

        <div className="flex gap-6 text-sm text-gray-600">
            <p>
              Productive Apps:
              <span className="font-medium text-green-600">
                {productiveCount}
              </span>
            </p>

            <p>
              Distracting Apps:
              <span className="font-medium text-red-500">
                {distractingCount}
              </span>
            </p>
        </div>
       </div>

    </div>
  );
}