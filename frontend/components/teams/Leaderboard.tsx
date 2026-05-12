const leaderboard = [
  {
    name: "Brian",
    score: 92,
  },
  {
    name: "Samuel",
    score: 85,
  },
  {
    name: "Daniel",
    score: 70,
  },
];

export default function Leaderboard() {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-4">
        Leaderboard
      </h2>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div key={user.name}>
            <div className="flex justify-between mb-1">
              <span>
                #{index + 1} {user.name}
              </span>

              <span>{user.score}%</span>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${user.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}