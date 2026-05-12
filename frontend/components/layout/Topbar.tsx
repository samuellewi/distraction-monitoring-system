export default function Topbar() {
  return (
    <div className="h-full bg-white border-b  border-gray-200 flex items-center justify-between px-6">

      {/* LEFT */}
      <h1 className="text-lg font-semibold">Welcome, Brian 👋</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH (dummy dulu) */}
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-md text-sm outline-none"
        />

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
            B
          </div>
        </div>

      </div>
    </div>
  );
}