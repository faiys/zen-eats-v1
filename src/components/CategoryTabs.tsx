import React from 'react';
import { FoodItem } from '../data/foodItems';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: FoodItem['category'];
  onSelectCategory: (category: FoodItem['category']) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts
}) => {
  return (
    <div className="w-full border-b border-stone-200/80 bg-white sticky top-16 sm:top-20 z-30 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`group relative whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30 ring-2 ring-red-600/30'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200 hover:text-slate-900 shadow-xs'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-stone-200 text-slate-600 group-hover:bg-stone-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
