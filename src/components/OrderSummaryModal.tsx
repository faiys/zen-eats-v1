import React from 'react';
import { X, FileDown, CalendarDays, Users } from 'lucide-react';
import { OrderSummary } from '../service/Manage';

interface OrderSummaryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  summary: OrderSummary | null;
  onClose: () => void;
  onExport: () => void;
}

// Preview of today's orders (category -> item -> users) before exporting as PDF
export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  isLoading,
  summary,
  onClose,
  onExport
}) => {
  if (!isOpen) return null;

  const hasOrders = Boolean(summary && summary.totalOrders > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 tracking-tight">
              Order Summary
            </h2>
            {summary && (
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-red-500" />
                  {summary.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-red-500" />
                  {summary.totalOrders} {summary.totalOrders === 1 ? 'order' : 'orders'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close order summary"
            className="w-9 h-9 shrink-0 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-slate-500">Loading orders...</p>
          ) : !hasOrders || !summary ? (
            <p className="py-12 text-center text-sm text-slate-500">No orders for today.</p>
          ) : (
            <>
              {/* Category counts */}
              <div className="flex flex-wrap gap-2">
                {summary.categories.map((cat) => (
                  <span
                    key={cat.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-slate-700 text-xs font-semibold"
                  >
                    {cat.name}
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full">
                      {cat.count}
                    </span>
                  </span>
                ))}
              </div>

              {/* Item -> ordered users, per category */}
              {summary.categories.map((cat) => (
                <section key={cat.name}>
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2">
                    {cat.name} <span className="text-slate-400">({cat.count})</span>
                  </h3>
                  <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                    {cat.items.map((item) => (
                      <div key={item.name} className="px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                        <div className="sm:w-48 shrink-0 flex items-center justify-between sm:justify-start gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          <span className="text-xs font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-full">
                            {item.count}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {item.users.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white border border-stone-200 text-slate-700 hover:bg-stone-100 transition-all"
          >
            Close
          </button>
          <button
            onClick={onExport}
            disabled={isLoading || !hasOrders}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};
