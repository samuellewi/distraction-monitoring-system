"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Productive", value: 320 },
  { name: "Distracting", value: 140 },
];

const COLORS = ["#22c55e", "#ef4444"];

export default function Chart() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-[320px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">
        Productivity Overview
      </h2>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}

              
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">460m</span>
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