"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import Chart from "@/components/dashboard/Chart";
import ActivityList from "@/components/dashboard/ActivityList";

export default function DashboardPage() {
  
  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Here’s your productivity overview today
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard title="Productive Time" value="5h 20m" subtitle="Today" />
        <StatsCard title="Distracting Time" value="2h 10m" subtitle="Today" />
        <StatsCard title="Top App" value="YouTube" subtitle="Most used" />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-2 gap-6">
        <Chart />
        <ActivityList />
      </div>

    </div>
  );
}