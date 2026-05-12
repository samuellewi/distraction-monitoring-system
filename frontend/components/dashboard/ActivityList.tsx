export default function ActivityList() {
  return (
    <div className="bg-white rounded-2xl border p-6 h-[320px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-3 text-sm flex-1">

        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-medium">YouTube</span>
          <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full">
            Distracting
          </span>
          <span className="text-gray-500">1h 20m</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-medium">VSCode</span>
          <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
            Productive
          </span>
          <span className="text-gray-500">2h 10m</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">Instagram</span>
          <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full">
            Distracting
          </span>
          <span className="text-gray-500">45m</span>
        </div>

      </div>
    </div>
  );
}