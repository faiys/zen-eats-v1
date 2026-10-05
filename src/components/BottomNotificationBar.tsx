import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { OrderState } from '../hooks/useOrder';

interface BottomNotificationBarProps {
  order: OrderState;
  onOpenCart: () => void;
}

export const BottomNotificationBar: React.FC<BottomNotificationBarProps> = ({
  order,
  onOpenCart,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // If no item is selected or user explicitly closed it this turn, don't show
  if (!order.selectedItem || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-red-600 text-white shadow-2xl transition-transform animate-slide-up border-t border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left message with shopping bag icon matching DreamsFood */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {order.isConfirmed ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium truncate">
            {order.isConfirmed ? (
              <span>
                <strong className="font-bold">Order Confirmed!</strong> {order.selectedItem.name} reserved for you
              </span>
            ) : (
              <span>
                <strong className="font-bold">1 item selected:</strong> {order.selectedItem.name} (₹{order.selectedItem.price})
              </span>
            )}
          </div>
        </div>

        {/* Right actions: Go to checkout and Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="bg-white hover:bg-stone-100 text-red-600 font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1"
          >
            <span>{order.isConfirmed ? 'View Receipt' : 'Go to checkout'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="w-7 h-7 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
