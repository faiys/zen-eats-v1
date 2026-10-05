import React, { useState } from 'react';
import { ZohoImage } from './ZohoImage';
import {
  X,
  Heart,
  ShoppingBag,
  Check,
  Lock,
  Utensils
} from 'lucide-react';
import { FoodItem } from '../data/foodItems';
import { OrderState } from '../hooks/useOrder';

interface ProductDetailsModalProps {
  item: FoodItem | null;
  order: OrderState;
  onClose: () => void;
  onSelect: (item: FoodItem, addOns: string[], instructions: string) => void;
  onConfirmOrder: (item: FoodItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  item,
  order,
  onClose,
  onSelect,
  onConfirmOrder,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!item) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isCurrentSelection = order.selectedItem?.id === item.id;
  const isOtherSelected = Boolean(order.selectedItem && !isCurrentSelection);

  // Same as card "Add" / "Switch to this": select item and open shopping cart to confirm there
  const handleOrderNow = () => {
    onSelect(item, [], '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-y-auto md:overflow-hidden my-auto border border-stone-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100/90 hover:bg-stone-200 text-slate-700 flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Large Image & Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-stone-50/70 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80">
          <div>
            {/* Main Active Image with Zoom effect */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 shadow-inner group">
              <ZohoImage
                src={item.images[activeImageIndex] || item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Gallery (Up to 3 images as required) */}
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-red-600 ring-2 ring-red-500/20 shadow-md scale-105'
                      : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ZohoImage
                    src={img}
                    alt={`${item.name} preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Portion Info at bottom left (hidden when not set) */}
          {item.portion && (
            <div className="mt-4 pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-red-500" />
                {item.portion}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Information & Single-Item Action */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between md:overflow-y-auto md:max-h-[85vh]">
          <div>
            {/* Category Pill & Wishlist row */}
            <div className="flex items-center justify-between gap-2">
              <span className="bg-orange-100/70 text-orange-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </span>

              <button
                onClick={() => onToggleWishlist(item.id)}
                aria-label="Wishlist toggle"
                className="mr-10 sm:mr-7 shrink-0 w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-stone-50 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`}
                />
              </button>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight mt-2 leading-tight">
              {item.name}
            </h2>

            {/* Full Description */}
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.fullDescription}
            </p>

            {/* Veg / Non-Veg Badge (hidden when not set) */}
            {item.isVeg !== undefined && (
            <div className="mt-4 py-2 border-y border-stone-100 text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                {item.isVeg ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-600 p-[1.5px] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    Veg
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-700">
                    <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-red-600 p-[1.5px] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    </span>
                    Non Veg
                  </span>
                )}
              </div>
            </div>
            )}

            {/* Quantity info (Enforced 1 item per employee) */}
            <div className="mt-4 flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
              <div className="text-xs">
                <span className="font-bold text-slate-800">Quantity:</span>
                <span className="ml-2 text-stone-500 font-medium">1 serving</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                1 snack per employee rule
              </span>
            </div>
          </div>

          {/* ACTION BUTTON: Order Now */}
          <div className="mt-6 pt-4 border-t border-stone-100">
            {isCurrentSelection ? (
              <div className="space-y-2">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>
                      {order.isConfirmed
                        ? 'Order Confirmed for Friday!'
                        : 'Currently selected in your cart'}
                    </span>
                  </div>
                </div>

                {!order.isConfirmed && (
                  <button
                    onClick={() => {
                      onConfirmOrder(item);
                      onClose();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-6 rounded-full shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Confirm Friday Order
                  </button>
                )}
              </div>
            ) : isOtherSelected ? (
              <div className="space-y-2">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    You already have <strong>{order.selectedItem?.name}</strong> in your order.
                  </span>
                </div>

                <button
                  onClick={handleOrderNow}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-full shadow-lg shadow-red-500/25 flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order This Now
                </button>
              </div>
            ) : (
              <button
                onClick={handleOrderNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-full shadow-lg shadow-red-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                Order Now
              </button>
            )}

            {/* Popular tags */}
            {item.popularTags && item.popularTags.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                {item.popularTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-stone-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

