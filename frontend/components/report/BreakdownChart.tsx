export default function BreakdownChart({
  filter,
}: {
  filter: string;
}) {

  return (
    <div className="bg-white border rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Distraction Breakdown
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Current filter: {filter}
      </p>

      <div className="space-y-4">

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Social Media</span>
            <span>40%</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full">
            <div className="bg-red-400 h-2 rounded-full w-[40%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Entertainment</span>
            <span>30%</span>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full">
            <div className="bg-yellow-400 h-2 rounded-full w-[30%]" />
          </div>
        </div>

      </div>

    </div>
  );
}