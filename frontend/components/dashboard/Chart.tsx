"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

type Props = {
  productiveSeconds: number;
  distractingSeconds: number;
  totalSeconds?: number;
};

function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export default function Chart({
  productiveSeconds,
  distractingSeconds,
  totalSeconds,
}: Props) {
  const chartData = [
    { name: "Productive", value: productiveSeconds },
    { name: "Distracting", value: distractingSeconds },
  ];
  const hasTrackedTime = chartData.some((item) => item.value > 0);
  const displayData = hasTrackedTime
    ? chartData
    : [
        { name: "Productive", value: 0 },
        { name: "Distracting", value: 0 },
      ];
  const displayedTotalSeconds =
    totalSeconds ?? productiveSeconds + distractingSeconds;

  return (
    <div className="bg-white rounded-2xl border p-6 h-[320px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">
        Productivity Overview
      </h2>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}

              
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">
            {formatDuration(displayedTotalSeconds)}
          </span>
          <span className="text-xs text-gray-400">Total Time</span>
        </div>

      </div>

      <div className="flex justify-center gap-6 text-sm mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          Productive
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          Distracting
        </div>
      </div>
    </div>
  );
}
