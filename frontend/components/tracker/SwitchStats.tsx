type Activity = {
  id: string;
  appName: string;
};

function getAppStats(activities: Activity[]) {
  const counts = activities.reduce((acc, activity) => {
    acc.set(activity.appName, (acc.get(activity.appName) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Array.from(counts.entries())
    .map(([app, count]) => ({ app, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
}

export default function SwitchStats({
  activities,
  isLoading,
}: {
  activities: Activity[];
  isLoading: boolean;
}) {
  const appStats = getAppStats(activities);
  const maxCount = Math.max(...appStats.map((item) => item.count), 1);

  return (
    <div className="bg-white border rounded-xl p-5 h-full w-full">

      <p className="text-sm text-gray-500">Activity Sessions</p>
      <h2 className="text-2xl font-semibold mt-2 mb-4">
        {isLoading ? "Loading..." : `${activities.length} total`}
      </h2>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">
            Loading activity breakdown...
          </p>
        ) : null}

        {!isLoading && appStats.length === 0 ? (
          <p className="text-sm text-gray-500">
            No app activity available for this range.
          </p>
        ) : null}

        {!isLoading && appStats.map((item) => (
          <div key={item.app}>

            {/* TEXT */}
            <div className="flex justify-between text-sm">
              <span>{item.app}</span>
              <span className="text-gray-500">{item.count}</span>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
