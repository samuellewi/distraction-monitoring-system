"use client";

import { useSyncExternalStore } from "react";

type StoredAuthUser = {
  name?: unknown;
};

function getStoredUserName() {
  try {
    const storedUser = localStorage.getItem("authUser");

    if (!storedUser) return "User";

    const parsedUser = JSON.parse(storedUser) as StoredAuthUser;

    if (typeof parsedUser.name === "string" && parsedUser.name.trim()) {
      return parsedUser.name;
    }
  } catch {
    return "User";
  }

  return "User";
}

function subscribeToAuthUser(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

export default function Topbar() {
  const userName = useSyncExternalStore(
    subscribeToAuthUser,
    getStoredUserName,
    () => "User",
  );
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="h-full bg-white border-b  border-gray-200 flex items-center justify-between px-6">

      {/* LEFT */}
      <h1 className="text-lg font-semibold">Welcome, {userName} 👋</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH (dummy dulu) */}
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-md text-sm outline-none"
        />

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
            {userInitial}
          </div>
        </div>

      </div>
    </div>
  );
}
