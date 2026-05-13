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
  activities: Activity[];
};

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

function formatStartedAt(startedAt: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startedAt));
}

function getCategoryLabel(activity: Activity) {
  if (!activity.category) return "Neutral";

  return activity.category.name || activity.category.type.toLowerCase();
}

function getCategoryClass(activity: Activity) {
  if (activity.category?.type === "PRODUCTIVE") {
    return "text-green-600 bg-green-50";
  }

  if (activity.category?.type === "DISTRACTING") {
    return "text-red-500 bg-red-50";
  }

  return "text-gray-500 bg-gray-50";
}

export default function ActivityList({ activities }: Props) {
  return (
    <div className="bg-white rounded-2xl border p-6 h-[320px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-3 text-sm flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        ) : null}

        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex justify-between items-center pb-2 ${
              index < activities.length - 1 ? "border-b" : ""
            }`}
          >
            <div>
              <span className="font-medium block">{activity.appName}</span>
              <span className="text-xs text-gray-400">
                {formatStartedAt(activity.startedAt)}
              </span>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${getCategoryClass(activity)}`}
            >
              {getCategoryLabel(activity)}
            </span>

            <span className="text-gray-500">
              {formatDuration(activity.durationSeconds)}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}
