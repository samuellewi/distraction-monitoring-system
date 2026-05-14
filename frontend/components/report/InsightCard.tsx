type Summary = {
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
  productivityScore: number;
};

type TopApp = {
  appName: string;
  totalDurationSeconds: number;
  activityCount: number;
};

type Activity = {
  id: string;
  appName: string;
  startedAt: string;
  durationSeconds: number;
  category: {
    name: string;
    type: string;
  } | null;
};

type Props = {
  filter: string;
  summary: Summary | null;
  topApps: TopApp[];
  recentActivities: Activity[];
  isLoading: boolean;
};

function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

function buildInsight(
  filter: string,
  summary: Summary | null,
  topApps: TopApp[],
  recentActivities: Activity[],
) {
  if (!summary || summary.totalTrackedSeconds === 0) {
    return "No activity has been recorded for this report period yet.";
  }

  const periodLabel =
    filter === "monthly" ? "this month" : filter === "weekly" ? "this week" : "in this period";
  const topApp = topApps[0];
  const recentDistractingActivity = recentActivities.find(
    (activity) => activity.category?.type === "DISTRACTING",
  );

  if (topApp) {
    return `${topApp.appName} is your most used app ${periodLabel}, with ${formatDuration(
      topApp.totalDurationSeconds,
    )} tracked. Your productivity score is ${summary.productivityScore}%.`;
  }

  if (recentDistractingActivity) {
    return `${recentDistractingActivity.appName} was recently classified as distracting ${periodLabel}.`;
  }

  return `Your productivity score is ${summary.productivityScore}% ${periodLabel}.`;
}

export default function InsightCard({
  filter,
  summary,
  topApps,
  recentActivities,
  isLoading,
}: Props) {
  const insight = isLoading
    ? "Loading report insight..."
    : buildInsight(filter, summary, topApps, recentActivities);

  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Work Pattern Insight
      </h2>

      <p className="text-gray-600">
        {insight}
      </p>

    </div>
  );
}
