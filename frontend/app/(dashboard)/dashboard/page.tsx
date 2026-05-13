"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import Chart from "@/components/dashboard/Chart";
import ActivityList from "@/components/dashboard/ActivityList";

const API_BASE_URL = "http://127.0.0.1:4000/api";

type Summary = {
  productiveSeconds: number;
  distractingSeconds: number;
};

type TopApp = {
  appName: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
  };
};

type DashboardData = {
  summary: Summary;
  topApps: TopApp[];
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

async function fetchDashboardResource<T>(path: string, token: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    throw new ApiError(
      result.error?.message || "Unable to load dashboard data.",
      response.status
    );
  }

  return result.data;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const authToken = token;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [summary, topApps] = await Promise.all([
          fetchDashboardResource<Summary>("/dashboard/summary", authToken),
          fetchDashboardResource<TopApp[]>("/dashboard/top-apps", authToken),
        ]);

        setData({ summary, topApps });
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
          setError("Unable to load dashboard data.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const productiveTime = data
    ? formatDuration(data.summary.productiveSeconds)
    : isLoading
      ? "Loading..."
      : "0m";
  const distractingTime = data
    ? formatDuration(data.summary.distractingSeconds)
    : isLoading
      ? "Loading..."
      : "0m";
  const topApp = data?.topApps[0]?.appName ?? (isLoading ? "Loading..." : "No data");

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

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <StatsCard title="Productive Time" value={productiveTime} subtitle="Today" />
        <StatsCard title="Distracting Time" value={distractingTime} subtitle="Today" />
        <StatsCard title="Top App" value={topApp} subtitle="Most used" />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-2 gap-6">
        <Chart />
        <ActivityList />
      </div>

    </div>
  );
}
