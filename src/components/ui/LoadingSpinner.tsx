type SpinnerColor = 'amber' | 'blue' | 'green' | 'purple' | 'indigo';

interface Props {
  color?: SpinnerColor;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const colorClasses: Record<SpinnerColor, string> = {
  amber: 'border-amber-500',
  blue: 'border-blue-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  indigo: 'border-indigo-500',
};

const defaultColor: SpinnerColor = 'amber';

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-[3px]',
  lg: 'h-14 w-14 border-[4px]',
};

export default function LoadingSpinner({ color = defaultColor, size = 'md', text }: Props) {
  const borderClass = colorClasses[color] ?? colorClasses[defaultColor];
  const szClass = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className={`animate-spin rounded-full ${szClass} border-t-transparent ${borderClass}`} />
        <span className="absolute inset-0 flex items-center justify-center text-lg animate-float">🍔</span>
      </div>
      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
