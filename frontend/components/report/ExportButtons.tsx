"use client";

type Summary = {
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
  productivityScore: number;
};

type DailyRow = {
  date: string;
  totalTrackedSeconds: number;
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
};

type TopApp = {
  appName: string;
  totalDurationSeconds: number;
  activityCount: number;
};

type CategoryBreakdown = {
  type: string;
  totalDurationSeconds: number;
  percentage: number;
};

type Activity = {
  id: string;
  appName: string;
  windowTitle: string;
  startedAt: string;
  durationSeconds: number;
  category: {
    name: string;
    type: string;
  } | null;
};

type ReportData = {
  summary: Summary;
  daily: DailyRow[];
  topApps: TopApp[];
  categoryBreakdown: CategoryBreakdown[];
  activities: Activity[];
};

type Props = {
  data: ReportData | null;
  disabled: boolean;
};

function escapeCsvValue(value: string | number) {
  const text = String(value);

  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }

  return text;
}

export default function ExportButtons({ data, disabled }: Props) {

  const handleExportCSV = () => {
    if (!data) return;

    const rows: Array<Array<string | number>> = [
      ["Section", "Name", "Duration Seconds", "Count", "Percentage"],
      ["Summary", "Total tracked", data.summary.totalTrackedSeconds, "", ""],
      ["Summary", "Productive", data.summary.productiveSeconds, "", ""],
      ["Summary", "Distracting", data.summary.distractingSeconds, "", ""],
      ["Summary", "Neutral", data.summary.neutralSeconds, "", ""],
      ["Summary", "Productivity score", "", "", data.summary.productivityScore],
      ...data.categoryBreakdown.map((item) => [
        "Category",
        item.type,
        item.totalDurationSeconds,
        "",
        item.percentage,
      ]),
      ...data.daily.map((item) => [
        "Daily",
        item.date,
        item.totalTrackedSeconds,
        "",
        "",
      ]),
      ...data.topApps.map((item) => [
        "Top app",
        item.appName,
        item.totalDurationSeconds,
        item.activityCount,
        "",
      ]),
      ...data.activities.map((activity) => [
        "Activity",
        activity.appName,
        activity.durationSeconds,
        "",
        activity.category?.type ?? "NEUTRAL",
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-3">

      <button
        onClick={handleExportCSV}
        disabled={disabled}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Export CSV
      </button>

      <button
        disabled
        className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg transition"
      >
        Export PDF
      </button>

    </div>
  );
}
