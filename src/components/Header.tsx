import { useRef } from 'react';
import { Clover, HelpCircle, Plus, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  connection: 'connecting' | 'connected' | 'error';
  onNewEvent: () => void;
  onSecret: () => void;
  onHelp: () => void;
}

export default function Header({ connection, onNewEvent, onSecret, onHelp }: HeaderProps) {
  const connected = connection === 'connected';
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 700) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    lastTapRef.current = now;

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      onSecret();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/85 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSecretTap}
              onTouchStart={handleSecretTap}
              className="relative rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label="Secret surprise"
            >
              <div className="w-10 h-10 rounded-2xl bg-sage-400 flex items-center justify-center shadow-soft">
                <Clover size={22} className="text-white" />
              </div>
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-slatey-700 leading-none tracking-tight">
                Clover Girls Club
              </h1>
              <p className="text-xs text-slatey-400 mt-0.5 hidden sm:block">
                Event & Finance Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onHelp}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slatey-600 shadow-soft transition hover:bg-cream-50"
              aria-label="Open how-to guide"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">How to</span>
            </button>
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                connected
                  ? 'bg-emeraldx-50 text-emeraldx-600'
                  : connection === 'error'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-slatey-50 text-slatey-400'
              }`}
              title={connected ? 'Connected to Supabase' : 'Supabase connection unavailable'}
            >
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hidden sm:inline">
                {connected ? 'Connected' : connection === 'error' ? 'Connection Error' : 'Connecting…'}
              </span>
            </div>
            <button onClick={onNewEvent} className="btn-primary text-sm">
              <Plus size={18} />
              <span className="hidden sm:inline">New Event</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
