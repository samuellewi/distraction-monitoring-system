import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 flex-shrink-0">
          <Topbar />
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#F2F5FA] p-8">
          {children}
        </main>

      </div>
    </div>
  );
}