import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toast: { id: number; text: string; type: 'success' | 'info' | 'warning' } | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-20 sm:top-24 left-4 right-4 sm:left-auto z-50 sm:w-full sm:max-w-sm bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-700/80 flex items-center justify-between gap-3 animate-slide-left text-xs font-medium">
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span>{toast.text}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-stone-400 hover:text-white p-1 rounded-md"
        aria-label="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
