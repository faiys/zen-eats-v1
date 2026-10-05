import React from 'react';
import { Search, X, Heart } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isFavoritesOnly,
  onToggleFavoritesOnly,
  totalResults,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Result count like DreamsFood "Showing all 12 results" */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-800 tracking-tight">
            Showing all {totalResults} {isFavoritesOnly ? 'favorite ' : ''}{totalResults === 1 ? 'snack' : 'snacks'}
          </span>
          {isFavoritesOnly && (
            <button
              onClick={onToggleFavoritesOnly}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
              title="Click to show all snacks"
            >
              <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>Favorites Only</span>
              <X className="w-3 h-3 text-red-500" />
            </button>
          )}
        </div>

        {/* Right: Search Input (full width on mobile) */}
        <div className="w-full md:w-auto flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-0 md:flex-none md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for snacks, samosa, pizza..."
              className="w-full bg-stone-50 border border-stone-200 rounded-full pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

