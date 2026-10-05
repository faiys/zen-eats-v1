import React from 'react';
import { ZohoImage } from './ZohoImage';
import {
  X,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Building,
  UserCheck
} from 'lucide-react';
import { EmployeeInfo, OrderState } from '../hooks/useOrder';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderState;
  employee: EmployeeInfo;
  onConfirmOrder: () => void;
  onChangeOrder: () => void;
  onOpenDetails: (item: any) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  order,
  employee,
  onConfirmOrder,
  onChangeOrder,
  onOpenDetails
}) => {

  if (!isOpen) return null;

  const item = order.selectedItem;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left border-l border-stone-200">
          {/* HEADER matching DreamsFood Image 1 */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-['Outfit'] text-slate-900 tracking-tight">
                Shopping Cart
              </h2>
              {item && (
                <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200">
                  1 item
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full hover:bg-stone-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* If Order is already confirmed - show DreamsFood Confirmation state */}
            {order.isConfirmed && item ? (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-bounce-subtle">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Order Confirmed
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                    Your Friday snack is ordered!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Our delivery person will bring your order to you as soon as possible.
                  </p>
                </div>

                {/* Confirmed Item Summary */}
                <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm text-left flex items-center gap-3">
                  <ZohoImage
                    src={item.images[0]}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Order ID: <span className="font-mono font-bold text-slate-800">{order.orderId}</span>
                    </p>
                    <p className="text-xs font-semibold text-emerald-700">
                      ₹0.00 (Sponsored by Company)
                    </p>
                  </div>
                </div>

                {/* Employee details */}
                <div className="bg-stone-50 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1 text-left border border-stone-200/60">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Employee:</span>
                    <span className="font-semibold text-slate-800">{employee.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confirmed At:</span>
                    <span className="font-semibold text-slate-800">{order.confirmedAt || 'Today'}</span>
                  </div>
                </div>
              </div>
            ) : item ? (
              /* ACTIVE CART ITEM (Unconfirmed) - Matches DreamsFood Image 1 */
              <div className="space-y-6">
                {/* Friday Allowance notice */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">Friday Snack Policy:</span> 1 complimentary item per person. All other items are currently locked.
                  </div>
                </div>

                {/* Item Card matching DreamsFood image 1 */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs relative flex items-center gap-4">
                  {/* Thumbnail with trash badge on top right */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                    <ZohoImage
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => onOpenDetails(item)}
                    />
                    <button
                      onClick={onChangeOrder}
                      title="Remove item"
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-sm transition-transform active:scale-90"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => onOpenDetails(item)}
                      className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors cursor-pointer truncate"
                    >
                      {item.name}
                    </h3>

                    {/* Stepper & Price row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Stepper with locked quantity 1 */}
                      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 px-2 py-0.5">
                        <button
                          disabled
                          className="text-stone-300 px-1.5 font-bold cursor-not-allowed text-xs"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-black text-slate-800">
                          1
                        </span>
                        <button
                          disabled
                          title="Max 1 snack per employee"
                          className="text-stone-300 px-1.5 font-bold cursor-not-allowed text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-['Outfit'] text-slate-900">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected add-ons if any */}
                {order.selectedAddOns && order.selectedAddOns.length > 0 && (
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs">
                    <span className="font-bold text-slate-700">Selected Add-ons:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-600">
                      {order.selectedAddOns.map((addonId) => {
                        const addon = item.addOns.find((a) => a.id === addonId);
                        return (
                          <li key={addonId} className="flex justify-between">
                            <span>• {addon?.name || addonId}</span>
                            <span className="text-slate-400 font-medium">Free</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Dietary note if any */}
                {order.specialInstructions && (
                  <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Note: </span>
                    <span>&ldquo;{order.specialInstructions}&rdquo;</span>
                  </div>
                )}

                {/* Subtotal breakdown matching DreamsFood Image 1 */}
                <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Company Perk Discount</span>
                    <span className="font-semibold text-emerald-600">-₹{item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-900">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-slate-900">₹0.00</span>
                  </div>

                  <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Due</span>
                    <div className="text-right">
                      <span className="text-xl font-black font-['Outfit'] text-slate-900">
                        ₹0.00
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Sponsored
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* EMPTY CART STATE */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    No snack selected yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Browse our Friday menu and click <strong>&ldquo;+ Add&rdquo;</strong> to choose your complimentary office treat!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM BUTTONS matching DreamsFood Image 1 */}
          <div className="p-4 sm:p-6 border-t border-stone-100 bg-stone-50/50">
            {order.isConfirmed ? (
              <button
                onClick={onClose}
                className="w-full bg-stone-900 hover:bg-black text-white font-bold text-sm py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                Close
              </button>
            ) : item ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onChangeOrder}
                  className="bg-black hover:bg-stone-800 text-white font-bold text-sm py-3.5 px-4 sm:px-6 rounded-full transition-all text-center active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirmOrder}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3.5 px-4 sm:px-6 rounded-full shadow-lg shadow-red-500/25 transition-all text-center active:scale-95"
                >
                  Confirm Order
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-stone-900 hover:bg-black text-white font-bold text-sm py-3.5 px-6 rounded-full transition-all active:scale-95"
              >
                Browse Menu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
