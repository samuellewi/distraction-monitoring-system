export default function TeamOverview() {
  const stats = [
    {
      title: "Total Members",
      value: "12",
      color: "text-blue-600",
    },
    {
      title: "Avg Productivity",
      value: "87%",
      color: "text-green-600",
    },
    {
      title: "Members Online",
      value: "9",
      color: "text-yellow-500",
    },
    {
      title: "Focus Hours",
      value: "42h",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white border rounded-2xl p-6">

      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Team Overview
        </h2>

        <p className="text-sm text-gray-500">
          General productivity summary
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.title}>
            <p className="text-sm text-gray-500 mb-2">
              {item.title}
            </p>

            <h2 className={`text-3xl font-semibold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

    </div>
  );
}