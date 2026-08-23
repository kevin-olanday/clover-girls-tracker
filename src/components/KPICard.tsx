import { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: ReactNode;
  accent?: 'sage' | 'coral' | 'emerald' | 'slate';
  trend?: { value: string; positive: boolean };
}

const accents = {
  sage: { bg: 'bg-sage-50', text: 'text-sage-600', ring: 'ring-sage-100' },
  coral: { bg: 'bg-coral-50', text: 'text-coral-500', ring: 'ring-coral-100' },
  emerald: { bg: 'bg-emeraldx-50', text: 'text-emeraldx-600', ring: 'ring-emeraldx-100' },
  slate: { bg: 'bg-slatey-50', text: 'text-slatey-500', ring: 'ring-slatey-100' },
};

export default function KPICard({
  label,
  value,
  sublabel,
  icon,
  accent = 'sage',
  trend,
}: KPICardProps) {
  const a = accents[accent];
  return (
    <div className="card p-4 sm:p-5 animate-slide-up hover:shadow-soft-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl ${a.bg} ${a.text} p-2 sm:p-2.5 ring-4 ${a.ring}`}>{icon}</div>
        {trend && (
          <span
            className={`text-xs font-semibold ${trend.positive ? 'text-emeraldx-600' : 'text-coral-500'}`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold font-display text-slatey-700 tracking-tight">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-slatey-400 mt-1">{label}</p>
      {sublabel && <p className="hidden sm:block text-xs text-slatey-300 mt-1">{sublabel}</p>}
    </div>
  );
}
