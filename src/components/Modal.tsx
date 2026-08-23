import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  centered = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';

  return (
    <div className={`fixed inset-0 z-50 flex justify-center p-4 ${centered ? 'items-center' : 'items-end sm:items-center'}`}>
      <div
        className="absolute inset-0 bg-slatey-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxW} bg-white ${centered ? 'rounded-3xl' : 'rounded-t-3xl sm:rounded-3xl'} shadow-soft-md animate-slide-up max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-cream-200">
          <div>
            <h2 className="text-lg font-semibold text-slatey-700">{title}</h2>
            {subtitle && <p className="text-sm text-slatey-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slatey-400 hover:bg-cream-100 hover:text-slatey-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-cream-200 flex items-center justify-end gap-3 bg-cream-50/50 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
