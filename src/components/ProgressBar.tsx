interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'sage' | 'coral' | 'emerald';
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'sage',
  size = 'md',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const colorClass =
    color === 'coral'
      ? 'bg-coral-400'
      : color === 'emerald'
        ? 'bg-emeraldx-400'
        : 'bg-sage-400';
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-slatey-400">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold text-slatey-500">
              {pct.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${h} bg-cream-200 rounded-full overflow-hidden`}>
        <div
          className={`${h} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
