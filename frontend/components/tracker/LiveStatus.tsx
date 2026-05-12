export default function LiveStatus() {
  return (
    <div className="bg-white border rounded-xl p-5 flex justify-between items-center">
      
      <div>
        <p className="text-sm text-gray-500">Currently using</p>
        <h2 className="text-lg font-semibold">Chrome</h2>
      </div>

      <div className="text-right">
        <p className="text-green-600 font-medium">Productive</p>
        <p className="text-sm text-gray-500">25 min</p>
      </div>

    </div>
  );
}