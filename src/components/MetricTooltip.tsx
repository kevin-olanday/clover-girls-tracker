import { HelpCircle } from 'lucide-react';

interface MetricTooltipProps {
  english: string;
  tagalog: string;
  language: 'en' | 'tl';
}

export default function MetricTooltip({ english, tagalog, language }: MetricTooltipProps) {
  const text = language === 'tl' ? tagalog : english;

  return (
    <span className="group relative inline-flex" title={text}>
      <button
        type="button"
        aria-label={text}
        className="rounded-full text-slatey-300 transition hover:text-sage-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
      >
        <HelpCircle size={13} />
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-52 -translate-x-1/2 rounded-lg bg-slatey-800 px-3 py-2 text-left text-xs font-normal leading-4 text-white shadow-soft group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}
