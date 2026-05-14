export default function LiveStatus() {
  return (
    <div className="bg-white border rounded-xl p-5 flex justify-between items-center">
      
      <div>
        <p className="text-sm text-gray-500">Tracking status</p>
        <h2 className="text-lg font-semibold">Desktop tracking is not active yet</h2>
      </div>

      <div className="text-right">
        <p className="text-gray-600 font-medium">History only</p>
        <p className="text-sm text-gray-500">Manual/backend activity records</p>
      </div>

    </div>
  );
}
