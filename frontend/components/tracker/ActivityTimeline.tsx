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
    weekday: "short",
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
    return "text-green-600";
  }

  if (activity.category?.type === "DISTRACTING") {
    return "text-red-500";
  }

  return "text-gray-500";
}

export default function ActivityTimeline({
  activities,
  isLoading,
}: {
  activities: Activity[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 h-full">

      <h2 className="text-xl font-semibold mb-6">
        Activity Timeline
      </h2>

      <div className="space-y-5">

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading activities...</p>
        ) : null}

        {!isLoading && activities.length === 0 ? (
          <p className="text-sm text-gray-500">
            No activity history is available for this range.
          </p>
        ) : null}

        {!isLoading && activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between border-b pb-4"
          >

            {/* LEFT */}
            <div className="min-w-0 pr-4">
              <p className="text-sm text-gray-400">
                {formatStartedAt(activity.startedAt)}
              </p>

              <h3 className="text-lg font-medium truncate">
                {activity.appName}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {activity.windowTitle}
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right shrink-0">

              <p
                className={`text-sm font-medium capitalize
                  ${getCategoryClass(activity)}
                `}
              >
                {getCategoryLabel(activity)}
              </p>

              <p className="text-gray-500">
                {formatDuration(activity.durationSeconds)}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
