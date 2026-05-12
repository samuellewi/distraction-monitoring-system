type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

export default function FilterBar({
  filter,
  setFilter,
}: Props) {
  return (
    <div className="flex gap-3">

      <button
        onClick={() => setFilter("today")}
        className={`px-4 py-2 rounded-lg text-sm transition
          ${
            filter === "today"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        Today
      </button>

      <button
        onClick={() => setFilter("weekly")}
        className={`px-4 py-2 rounded-lg text-sm transition
          ${
            filter === "weekly"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        Weekly
      </button>

    </div>
  );
}