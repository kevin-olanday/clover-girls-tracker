import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="rounded-2xl bg-cream-100 p-4 text-sage-300 mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-slatey-600">{title}</h3>
      {description && <p className="text-sm text-slatey-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
