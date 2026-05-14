"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DailyRow = {
  date: string;
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
};

type Props = {
  filter: string;
  data: DailyRow[];
  isLoading: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatHours(seconds: number) {
  return Math.round((seconds / 3600) * 10) / 10;
}

export default function TrendChart({ filter, data, isLoading }: Props) {

  const title =
    filter === "weekly"
      ? "Weekly Productivity Trend"
      : filter === "monthly"
      ? "Monthly Productivity Trend"
      : "Custom Productivity Trend";
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    Productive: formatHours(item.productiveSeconds),
    Distracting: formatHours(item.distractingSeconds),
    Neutral: formatHours(item.neutralSeconds),
  }));
  const hasData = data.some((item) => item.totalTrackedSeconds > 0);

  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading trend...
          </div>
        ) : !hasData ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No activity data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" unit="h" />
              <Tooltip formatter={(value) => [`${value}h`, ""]} />
              <Line
                type="monotone"
                dataKey="Productive"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Distracting"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Neutral"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
