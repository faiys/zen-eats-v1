import React, { useState } from 'react';
import { ZohoImage } from './ZohoImage';
import {
  Heart,
  Flame,
  Utensils,
  Leaf,
  Lock,
  Check,
  Eye,
  Plus
} from 'lucide-react';
import { FoodItem } from '../data/foodItems';

interface ProductCardProps {
  item: FoodItem;
  isSelected: boolean;
  isOtherSelected: boolean;
  isConfirmed: boolean;
  isWishlisted: boolean;
  onSelect: (item: FoodItem) => void;
  onOpenDetails: (item: FoodItem) => void;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  isSelected,
  isOtherSelected,
  isConfirmed,
  isWishlisted,
  onSelect,
  onOpenDetails,
  onToggleWishlist
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const getTagIcon = (tagType: FoodItem['tagType']) => {
    switch (tagType) {
      case 'healthy':
        return <Leaf className="w-3.5 h-3.5 text-emerald-600" />;
      case 'grilled':
        return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
      case 'baked':
        return <Utensils className="w-3.5 h-3.5 text-orange-600" />;
      case 'popular':
      case 'spicy':
      default:
        return <Flame className="w-3.5 h-3.5 text-red-500" />;
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isSelected
          ? 'border-red-500 ring-2 ring-red-500/25 shadow-xl shadow-red-500/10 scale-[1.01]'
          : isOtherSelected
          ? 'border-stone-200/80 opacity-60 hover:opacity-85 shadow-xs'
          : 'border-stone-200 hover:border-red-200 shadow-sm hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-1'
      }`}
    >
      {/* Locked Overlay badge if another item is active */}
      {isOtherSelected && !isSelected && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20 whitespace-nowrap">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Locked (1 Item Limit)</span>
          </div>
        </div>
      )}

      {/* Selected Ribbon Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-emerald-400/40 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{isConfirmed ? 'Order Confirmed' : 'Selected Snack'}</span>
          </div>
        </div>
      )}

      {/* IMAGE CONTAINER - Crystal clear with smooth zoom & knife sunlight reflection */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <ZohoImage
          src={item.images[activeImageIndex] || item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter-none cursor-pointer"
          referrerPolicy="no-referrer"
          onClick={() => onOpenDetails(item)}
        />

        {/* KNIFE SUNLIGHT REFLECTION / GLEAM EFFECT */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Broad soft glare sheen */}
          <div className="absolute top-0 -left-[140%] w-[80%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-[26deg] group-hover:left-[240%] transition-all duration-1000 ease-out" />
          {/* Sharp brilliant stainless knife-blade glint */}
          <div className="absolute top-0 -left-[140%] w-[30%] h-full bg-gradient-to-r from-transparent via-white/85 to-transparent -skew-x-[26deg] group-hover:left-[240%] transition-all duration-1000 ease-out delay-75 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>

        {/* Clickable Image Overlay with DreamsFood inspect hint - No Blur */}
        <div
          onClick={() => onOpenDetails(item)}
          className="absolute inset-0 bg-transparent cursor-pointer flex items-center justify-center z-15"
        >
          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/95 text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 hover:scale-105 active:scale-95 border border-stone-200/80">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            Click for Details
          </span>
        </div>

        {/* Top Badges */}
        {item.tagType === 'popular' && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-10">
            <span className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center shadow-sm">
              <Flame className="w-4 h-4 fill-current" />
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon (Top Right) */}
        {!isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id);
            }}
            aria-label="Save to favorites"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:text-red-600 hover:bg-white hover:scale-115 active:scale-90 transition-all duration-200 flex items-center justify-center shadow-sm group/btn"
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover/btn:scale-110 ${
                isWishlisted ? 'fill-red-600 text-red-600' : ''
              }`}
            />
          </button>
        )}

        {/* 3-Image Dot Indicator if hovered */}
        {item.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
            {item.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeImageIndex === idx ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Row 1: Veg/Non-Veg badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {item.isVeg === undefined ? null : item.isVeg ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-emerald-600 p-[1.5px] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  Veg
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-700">
                  <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-red-600 p-[1.5px] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  </span>
                  Non Veg
                </span>
              )}
            </div>

            {/* Small Category / Style Tag */}
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              {getTagIcon(item.tagType)}
              {item.tag}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onOpenDetails(item)}
            className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] tracking-tight group-hover:text-red-600 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {item.name}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* BOTTOM ROW: Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
          {/* ACTION BUTTON */}
          <div className="w-full flex items-center justify-end">
            {isSelected ? (
              <div className="flex items-center gap-2 w-full justify-end">
                <button
                  onClick={() => onOpenDetails(item)}
                  className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isConfirmed ? 'Ordered' : 'Selected'}
                </button>
              </div>
            ) : isOtherSelected ? (
              <button
                onClick={() => {
                  onSelect(item);
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 font-semibold text-xs py-2 px-3 rounded-full border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95 shadow-xs"
                title="Click to switch your order to this snack"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Switch to this</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(item)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-full shadow-sm shadow-red-500/25 hover:shadow-md hover:shadow-red-500/35 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
