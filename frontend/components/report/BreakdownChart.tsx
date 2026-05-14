type CategoryBreakdown = {
  type: string;
  totalDurationSeconds: number;
  percentage: number;
};

type Props = {
  filter: string;
  items: CategoryBreakdown[];
  isLoading: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  PRODUCTIVE: "bg-green-400",
  DISTRACTING: "bg-red-400",
  NEUTRAL: "bg-gray-400",
};

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

export default function BreakdownChart({ filter, items, isLoading }: Props) {
  const visibleItems = items.filter((item) => item.totalDurationSeconds > 0);

  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Distraction Breakdown
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Current filter: {filter}
      </p>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading breakdown...</p>
        ) : null}

        {!isLoading && visibleItems.length === 0 ? (
          <p className="text-sm text-gray-500">No category data for this period.</p>
        ) : null}

        {visibleItems.map((item) => (
          <div key={item.type}>
            <div className="flex justify-between text-sm mb-1">
              <span>{formatType(item.type)}</span>
              <span>
                {item.percentage}% · {formatDuration(item.totalDurationSeconds)}
              </span>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full">
              <div
                className={`${TYPE_COLORS[item.type] ?? "bg-blue-400"} h-2 rounded-full`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
