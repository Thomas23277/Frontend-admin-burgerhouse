interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = '📁', title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeInUp">
      <div className="text-7xl mb-6 animate-float">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 max-w-md">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
