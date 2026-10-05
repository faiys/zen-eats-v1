import React from 'react';
import { X, History, CalendarDays } from 'lucide-react';
import { ZohoImage } from './ZohoImage';
import { OrderHistoryEntry } from '../service/Manage';

interface OrderHistoryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  history: OrderHistoryEntry[] | null;
  today: string;
  onClose: () => void;
}

// Login user's orders, newest date first
export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  isLoading,
  history,
  today,
  onClose
}) => {
  if (!isOpen) return null;

  const orders = history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-red-600" />
              Order History
            </h2>
            {!isLoading && history && (
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close order history"
            className="w-9 h-9 shrink-0 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-slate-500">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">You have no orders yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {orders.map((entry) => {
                const isToday = entry.date === today;
                return (
                  <li key={entry.orderId} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                      {entry.image && (
                        <ZohoImage src={entry.image} alt={entry.itemName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{entry.itemName}</p>
                      <p className="text-xs text-slate-500 truncate">{entry.category}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <CalendarDays className="w-3.5 h-3.5 text-red-500" />
                        {entry.date || '-'}
                      </span>
                      {isToday && (
                        <span className="block mt-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                          Today
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
