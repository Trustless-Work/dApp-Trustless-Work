export default function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
