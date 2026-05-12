"use client";

import { useState } from "react";

import LiveStatus from "@/components/tracker/LiveStatus";
import ActivityTimeline from "@/components/tracker/ActivityTimeline";
import FilterBar from "@/components/tracker/FilterBar";
import SwitchStats from "@/components/tracker/SwitchStats";

export default function TrackerPage() {

  // FILTER STATE
  const [filter, setFilter] = useState("today");

  // TODAY DATA
  const todayData = [
    {
      time: "09:00",
      app: "VSCode",
      duration: "1h 20m",
      status: "productive",
    },
    {
      time: "10:30",
      app: "YouTube",
      duration: "40m",
      status: "distracting",
    },
    {
      time: "11:15",
      app: "Chrome",
      duration: "25m",
      status: "productive",
    },
  ];

  // WEEKLY DATA
  const weeklyData = [
    {
      time: "Monday",
      app: "VSCode",
      duration: "8h",
      status: "productive",
    },
    {
      time: "Tuesday",
      app: "YouTube",
      duration: "3h",
      status: "distracting",
    },
    {
      time: "Wednesday",
      app: "Chrome",
      duration: "5h",
      status: "productive",
    },
  ];

  // ACTIVE DATA
  const currentData =
    filter === "today" ? todayData : weeklyData;

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Activity Tracker
        </h1>

        <p className="text-sm text-gray-500">
          Monitor your app usage in real time
        </p>
      </div>

      {/* LIVE STATUS */}
      <LiveStatus />

      {/* FILTER */}
      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-6 items-stretch">

        {/* LEFT */}
        <div className="col-span-2">
          <ActivityTimeline data={currentData} />
        </div>

        {/* RIGHT */}
        <div className="col-span-1">
          <SwitchStats />
        </div>

      </div>

    </div>
  );
}