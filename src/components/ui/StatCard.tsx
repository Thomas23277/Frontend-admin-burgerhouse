interface StatCardProps {
  label: string;
  value: number;
  icon: string;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="card p-4 text-center">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-2xl font-black text-white mb-1">
        {value.toLocaleString()}
      </p>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}
