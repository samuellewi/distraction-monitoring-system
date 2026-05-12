type Activity = {
  time: string;
  app: string;
  duration: string;
  status: string;
};

export default function ActivityTimeline({
  data,
}: {
  data: Activity[];
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 h-full">

      <h2 className="text-xl font-semibold mb-6">
        Activity Timeline
      </h2>

      <div className="space-y-5">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b pb-4"
          >

            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-400">
                {item.time}
              </p>

              <h3 className="text-lg font-medium">
                {item.app}
              </h3>
            </div>

            {/* RIGHT */}
            <div className="text-right">

              <p
                className={`text-sm font-medium capitalize
                  ${
                    item.status === "productive"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                `}
              >
                {item.status}
              </p>

              <p className="text-gray-500">
                {item.duration}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}