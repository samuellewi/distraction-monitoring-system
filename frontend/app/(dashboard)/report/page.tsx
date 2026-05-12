"use client";

import { useState } from "react";

import TrendChart from "@/components/report/TrendChart";
import BreakdownChart from "@/components/report/BreakdownChart";
import InsightCard from "@/components/report/InsightCard";
import ExportButtons from "@/components/report/ExportButtons";

export default function ReportPage() {

  // FILTER STATE
  const [filter, setFilter] = useState("weekly");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Report
        </h1>

        <p className="text-sm text-gray-500">
          Analyze your productivity trends
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">

        <div className="flex items-center gap-3 relative">
          {/* WEEKLY */}
          <button
            onClick={() => {
              setFilter("weekly");
              setShowDatePicker(false);
            }}
            className={`px-5 py-2 rounded-xl transition ${
              filter === "weekly"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Weekly
          </button>

          {/* MONTHLY */}
          <button
            onClick={() => {
              setFilter("monthly");
              setShowDatePicker(false);
            }}
            className={`px-5 py-2 rounded-xl transition ${
              filter === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>

          {/* CUSTOM */}
          <button
            onClick={() => {
              setFilter("custom");
              setShowDatePicker(!showDatePicker);
            }}
            className={`px-5 py-2 rounded-xl transition flex items-center gap-2 ${
              filter === "custom"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Custom Date
            <span className="text-xs">
              ▼
            </span>
          </button>
        </div>
      </div>

       {showDatePicker && (
          <div className="mt-4 bg-white border border-black/5 rounded-2xl p-5 shadow-sm w-fit">

            <div className="flex items-end gap-4">

              {/* START */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-500">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* END */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-500">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* APPLY */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition">
                Apply
              </button>

            </div>

          </div>
        )}

      {/* TREND */}
      <TrendChart filter={filter} />

      {/* BOTTOM */}
      <div className="grid grid-cols-2 gap-6">

        <BreakdownChart filter={filter} />

        <InsightCard filter={filter} />

      </div>

      {/* EXPORT */}
      <ExportButtons />

    </div>
  );
}