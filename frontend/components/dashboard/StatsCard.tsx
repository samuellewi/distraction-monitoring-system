type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function StatsCard({ title, value, subtitle }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition relative overflow-hidden hover:scale-[1.02]">

      {/* ACCENT BAR */}
      <div className="absolute top-0 left-0 w-full h-1" />

      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-3xl font-semibold mt-2">{value}</h2>

      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}