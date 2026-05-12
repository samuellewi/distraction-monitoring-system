const data = [
  { app: "VSCode", count: 5 },
  { app: "YouTube", count: 3 },
  { app: "Instagram", count: 4 },
];

export default function SwitchStats() {
  return (
    <div className="bg-white border rounded-xl p-5 h-full w-full">

      <p className="text-sm text-gray-500">App Switch Frequency</p>
      <h2 className="text-2xl font-semibold mt-2 mb-4">12 times</h2>

      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i}>

            {/* TEXT */}
            <div className="flex justify-between text-sm">
              <span>{item.app}</span>
              <span className="text-gray-500">{item.count}x</span>
            </div>

            {/* BAR NAH INI DIA */}
            <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${item.count * 20}%` }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}