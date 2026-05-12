export default function InsightCard({
  filter,
}: {
  filter: string;
}) {

  const insight =
    filter === "weekly"
      ? "You are most productive between 9AM - 12PM."
      : filter === "monthly"
      ? "Your distraction rate decreased this month."
      : "Custom insight based on selected date.";

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