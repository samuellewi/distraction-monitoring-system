"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LiveStatus from "@/components/tracker/LiveStatus";
import ActivityTimeline from "@/components/tracker/ActivityTimeline";
import FilterBar from "@/components/tracker/FilterBar";
import SwitchStats from "@/components/tracker/SwitchStats";

const API_BASE_URL = "http://127.0.0.1:4000/api";

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

function getActivityRange(filter: string): DateRange {
  const today = new Date();
  const from = startOfDay(today);
  const to = endOfDay(today);

  if (filter === "weekly") {
    from.setDate(from.getDate() - 6);
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function buildQuery(range: DateRange) {
  const params = new URLSearchParams({
    from: range.from,
    to: range.to,
    limit: "200",
  });

  return params.toString();
}

async function fetchTrackerActivities(path: string, token: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as ApiResponse<ActivitiesResponse>;

  if (!response.ok || !result.success || !result.data) {
    throw new ApiError(
      result.error?.message || "Unable to load activity data.",
      response.status,
    );
  }

  return result.data.items;
}

export default function TrackerPage() {
  const router = useRouter();

  // FILTER STATE
  const [filter, setFilter] = useState("today");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeRange = useMemo(() => getActivityRange(filter), [filter]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const authToken = token;
    const query = buildQuery(activeRange);

    async function loadActivities() {
      setIsLoading(true);
      setError("");

      try {
        const items = await fetchTrackerActivities(`/activities?${query}`, authToken);
        setActivities(items);
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
          setError("Unable to load activity data.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadActivities();
  }, [activeRange, router]);

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Activity Tracker
        </h1>

        <p className="text-sm text-gray-500">
          Review backend activity history
        </p>
      </div>

      {/* LIVE STATUS */}
      <LiveStatus />

      {/* FILTER */}
      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-6 items-stretch">

        {/* LEFT */}
        <div className="col-span-2">
          <ActivityTimeline activities={activities} isLoading={isLoading} />
        </div>

        {/* RIGHT */}
        <div className="col-span-1">
          <SwitchStats activities={activities} isLoading={isLoading} />
        </div>

      </div>

    </div>
  );
}
