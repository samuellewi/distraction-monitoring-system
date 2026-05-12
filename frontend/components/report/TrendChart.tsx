export default function TrendChart({
  filter,
}: {
  filter: string;
}) {

  const title =
    filter === "weekly"
      ? "Weekly Productivity Trend"
      : filter === "monthly"
      ? "Monthly Productivity Trend"
      : "Custom Productivity Trend";

  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      <div className="h-72 flex items-center justify-center text-gray-400">
        Chart Placeholder 📈
      </div>

    </div>
  );
}