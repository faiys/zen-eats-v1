import React from 'react';
import { FoodItem } from '../data/foodItems';
import { ProductCard } from './ProductCard';
import { OrderState } from '../hooks/useOrder';
import { Sparkles, Filter, Heart } from 'lucide-react';

interface ProductGridProps {
  items: FoodItem[];
  order: OrderState;
  wishlist: string[];
  isFavoritesOnly?: boolean;
  onToggleFavoritesOnly?: () => void;
  onSelect: (item: FoodItem) => void;
  onOpenDetails: (item: FoodItem) => void;
  onToggleWishlist: (id: string) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  items,
  order,
  wishlist,
  isFavoritesOnly = false,
  onToggleFavoritesOnly,
  onSelect,
  onOpenDetails,
  onToggleWishlist,
  onResetFilters
}) => {
  const selectedId = order.selectedItem?.id;
  const hasSelectedItem = Boolean(order.selectedItem);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-slate-400 mb-4">
          {isFavoritesOnly ? (
            <Heart className="w-8 h-8 text-red-500 fill-red-100" />
          ) : (
            <Filter className="w-8 h-8" />
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-['Outfit']">
          {isFavoritesOnly ? 'No favorite snacks saved yet' : 'No Friday snacks found'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          {isFavoritesOnly
            ? 'Click the heart icon on any snack card to save your favorites, or switch back to view the full menu.'
            : 'No snacks matched your search or category filter. Try clearing your filters to view all menu choices.'}
        </p>
        {isFavoritesOnly && onToggleFavoritesOnly ? (
          <button
            onClick={onToggleFavoritesOnly}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-5 py-2 rounded-full shadow-sm transition-all"
          >
            Show All Snacks
          </button>
        ) : onResetFilters ? (
          <button
            onClick={onResetFilters}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-5 py-2 rounded-full shadow-sm transition-all"
          >
            Reset Filters
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Informative single-item status alert above grid */}
      {hasSelectedItem && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>1-Item Limit Active:</strong> You selected <strong>{order.selectedItem?.name}</strong>. Use &ldquo;Switch to this&rdquo; on another item to change it.
            </span>
          </div>
        </div>
      )}

      {/* Grid: 4 columns desktop, 3 laptop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isOtherSelected = hasSelectedItem && !isSelected;
          const isWishlisted = wishlist.includes(item.id);

          return (
            <ProductCard
              key={item.id}
              item={item}
              isSelected={isSelected}
              isOtherSelected={isOtherSelected}
              isConfirmed={order.isConfirmed}
              isWishlisted={isWishlisted}
              onSelect={onSelect}
              onOpenDetails={onOpenDetails}
              onToggleWishlist={onToggleWishlist}
            />
          );
        })}
      </div>
    </div>
  );
};
