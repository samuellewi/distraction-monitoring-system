"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import TrendChart from "@/components/report/TrendChart";
import BreakdownChart from "@/components/report/BreakdownChart";
import InsightCard from "@/components/report/InsightCard";
import ExportButtons from "@/components/report/ExportButtons";

const API_BASE_URL = "http://127.0.0.1:4000/api";

type Summary = {
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
  productivityScore: number;
};

type DailyRow = {
  date: string;
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
};

type TopApp = {
  appName: string;
  totalDurationSeconds: number;
  activityCount: number;
};

type CategoryBreakdown = {
  type: string;
  totalDurationSeconds: number;
  percentage: number;
};

type Activity = {
  id: string;
  appName: string;
  windowTitle: string;
  startedAt: string;
  durationSeconds: number;
  category: {
    name: string;
    type: string;
  } | null;
};

type ActivitiesResponse = {
  items: Activity[];
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
};

type ReportData = {
  summary: Summary;
  daily: DailyRow[];
  topApps: TopApp[];
  categoryBreakdown: CategoryBreakdown[];
  activities: Activity[];
};

type DateRange = {
  from: string;
  to: string;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function endOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(23, 59, 59, 999);
  return nextDate;
}

function getPresetRange(filter: string): DateRange {
  const today = new Date();
  const from = startOfDay(today);
  const to = endOfDay(today);

  if (filter === "monthly") {
    from.setDate(from.getDate() - 29);
  } else {
    from.setDate(from.getDate() - 6);
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function getCustomRange(startDate: string, endDate: string): DateRange | null {
  if (!startDate || !endDate) return null;

  const from = startOfDay(new Date(startDate));
  const to = endOfDay(new Date(endDate));

  if (from > to) return null;

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function buildQuery(range: DateRange) {
  const params = new URLSearchParams({
    from: range.from,
    to: range.to,
  });

  return params.toString();
}

async function fetchReportResource<T>(path: string, token: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    throw new ApiError(
      result.error?.message || "Unable to load report data.",
      response.status,
    );
  }

  return result.data;
}

export default function ReportPage() {
  const router = useRouter();
  // FILTER STATE
  const [filter, setFilter] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedCustomRange, setAppliedCustomRange] = useState<DateRange | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeRange = useMemo(() => {
    if (filter === "custom") {
      return appliedCustomRange;
    }

    return getPresetRange(filter);
  }, [appliedCustomRange, filter]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!activeRange) {
      return;
    }

    const authToken = token;
    const query = buildQuery(activeRange);

    async function loadReport() {
      setIsLoading(true);
      setError("");

      try {
        const [summary, daily, topApps, categoryBreakdown, activitiesResult] =
          await Promise.all([
            fetchReportResource<Summary>(`/dashboard/summary?${query}`, authToken),
            fetchReportResource<DailyRow[]>(`/dashboard/daily?${query}`, authToken),
            fetchReportResource<TopApp[]>(`/dashboard/top-apps?${query}&limit=5`, authToken),
            fetchReportResource<CategoryBreakdown[]>(
              `/dashboard/category-breakdown?${query}`,
              authToken,
            ),
            fetchReportResource<ActivitiesResponse>(`/activities?${query}&limit=10`, authToken),
          ]);

        setData({
          summary,
          daily,
          topApps,
          categoryBreakdown,
          activities: activitiesResult.items,
        });
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          router.replace("/login");
          return;
        }

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unable to load report data.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [activeRange, router]);

  function applyCustomRange() {
    const customRange = getCustomRange(startDate, endDate);

    if (!customRange) {
      setError("Choose a valid start and end date to load a custom report.");
      return;
    }

    setAppliedCustomRange(customRange);
  }

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
              setAppliedCustomRange(null);
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
              setAppliedCustomRange(null);
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
              setData(null);
              setIsLoading(false);
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
              <button
                type="button"
                onClick={applyCustomRange}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition"
              >
                Apply
              </button>

            </div>

          </div>
        )}

      {isLoading ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-600">
          Loading report data...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}

      {/* TREND */}
      <TrendChart filter={filter} data={data?.daily ?? []} isLoading={isLoading} />

      {/* BOTTOM */}
      <div className="grid grid-cols-2 gap-6">

        <BreakdownChart
          filter={filter}
          items={data?.categoryBreakdown ?? []}
          isLoading={isLoading}
        />

        <InsightCard
          filter={filter}
          summary={data?.summary ?? null}
          topApps={data?.topApps ?? []}
          recentActivities={data?.activities ?? []}
          isLoading={isLoading}
        />

      </div>

      {/* EXPORT */}
      <ExportButtons data={data} disabled={isLoading || !data} />

    </div>
  );
}
