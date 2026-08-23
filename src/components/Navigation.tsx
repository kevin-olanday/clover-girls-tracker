import { LayoutDashboard, CalendarDays, ShoppingBag, Building2, Users, Eye, EyeOff } from 'lucide-react';
import { TabKey } from '@/lib/types';

interface NavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  showAttribution: boolean;
  onToggleAttribution: () => void;
}

const tabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'expenses', label: 'Expenses', icon: ShoppingBag },
  { key: 'venues', label: 'Venues & Income', icon: Building2 },
  { key: 'members', label: 'Participants', icon: Users },
];

export default function Navigation({ active, onChange, showAttribution, onToggleAttribution }: NavProps) {
  return (
    <>
      {/* Desktop / tablet top tabs */}
      <nav className="sticky top-16 z-30 bg-cream-50/85 backdrop-blur-md border-b border-cream-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange(key)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    isActive ? 'text-sage-600' : 'text-slatey-400 hover:text-slatey-600'
                  }`}
                >
                  <Icon size={17} />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sage-400 rounded-full" />
                  )}
                </button>
              );
            })}
            </div>
            <button
              type="button"
              onClick={onToggleAttribution}
              title={showAttribution ? 'Hide added-by names' : 'Show added-by names'}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slatey-500 transition hover:bg-cream-50"
            >
              {showAttribution ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{showAttribution ? 'Names' : 'Names hidden'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 sm:hidden">
        <div className="flex items-center justify-between gap-1 px-2 py-1.5 safe-area">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-sage-600' : 'text-slatey-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onToggleAttribution}
            title={showAttribution ? 'Hide added-by names' : 'Show added-by names'}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-colors ${showAttribution ? 'text-sage-600' : 'text-slatey-400'}`}
          >
            {showAttribution ? <Eye size={20} /> : <EyeOff size={20} />}
            <span className="text-[10px] font-semibold">Names</span>
          </button>
        </div>
      </nav>
    </>
  );
}
