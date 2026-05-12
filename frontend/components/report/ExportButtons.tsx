"use client";

export default function ExportButtons() {

  const handleExportCSV = () => {
    const data = [
      ["App", "Duration", "Type"],
      ["VSCode", "2h 10m", "Productive"],
      ["YouTube", "45m", "Distracting"],
      ["Notion", "1h 20m", "Productive"],
    ];

    const csvContent = data
      .map((row) => row.join(","))
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
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Export CSV
      </button>

      <button
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        Export PDF
      </button>

    </div>
  );
}