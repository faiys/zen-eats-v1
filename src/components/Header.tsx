import React from 'react';
import { Heart, ShoppingBag, CheckCircle2, History, ClipboardCheck, FileDown } from 'lucide-react';
import { FoodItem } from '../data/foodItems';
import { EmployeeInfo, OrderState } from '../hooks/useOrder';

interface HeaderProps {
    order: OrderState;
    employee: EmployeeInfo;
    wishlistCount: number;
    isFavoritesOnly: boolean;
    onToggleFavoritesOnly: () => void;
    onOpenCart: () => void;
    onOpenHistory: () => void;
    showChecklist?: boolean;
    onOpenChecklist?: () => void;
    showExportPDF?: boolean;
    onExportPDF?: () => void;
    onChangeOrder: () => void;
    onSelectCategory?: (category: FoodItem['category']) => void;
}

export const Header: React.FC<HeaderProps> = ({
    order,
    employee,
    wishlistCount,
    isFavoritesOnly,
    onToggleFavoritesOnly,
    onOpenCart,
    onOpenHistory,
    showChecklist = false,
    onOpenChecklist,
    showExportPDF = false,
    onExportPDF,
}) => {
    const hasItem = Boolean(order.selectedItem);

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
                    {/* Brand Logo */}
                    <div className="flex items-center min-w-0">
                        <a href="#" className="flex items-center gap-2.5 group min-w-0">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                                {/* Chef Hat with steam logo SVG */}
                                <svg
                                    className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.06 6.06c-.46-.74-1.2-1.3-2.06-1.57C15.65 3.1 14.47 2 13 2c-1.3 0-2.38.86-2.82 2.07C9.37 3.86 8.5 4.3 8 5c-.71.93-.86 2.14-.42 3.23C6.42 8.78 5.5 10 5.5 11.5c0 1.93 1.57 3.5 3.5 3.5h10c1.93 0 3.5-1.57 3.5-3.5 0-1.74-1.27-3.18-2.94-3.44.03-.33 0-.67-.06-1-.13-.71-.47-1.35-.94-2M6 17v2c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-2H6z" />
                                </svg>
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <div className="flex items-center">
                                    <span className="text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                                        Zen
                                    </span>
                                    <span className="text-2xl font-black tracking-tight text-red-600 font-['Outfit']">
                                        Eats
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                                    Friday Snacks
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Right Action Icons & Employee Profile */}
                    <div className="flex items-center gap-1 min-[380px]:gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
                        {/* Wishlist icon with badge - Toggles Favorites Only */}
                        <button
                            onClick={onToggleFavoritesOnly}
                            aria-label={isFavoritesOnly ? 'Show all snacks' : 'Show favorite snacks only'}
                            title={isFavoritesOnly ? 'Viewing favorites only (click to show all)' : 'Show favorite snacks only'}
                            className={`relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${isFavoritesOnly
                                ? 'bg-red-50 border-red-400 text-red-600 ring-2 ring-red-500/20 shadow-sm'
                                : 'border-stone-200 text-slate-700 hover:text-red-600 hover:border-red-300 bg-stone-50/70'
                                }`}
                        >
                            <Heart className={`w-5 h-5 transition-transform active:scale-90 ${isFavoritesOnly ? 'fill-red-600 text-red-600' : ''}`} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Cart Icon with badge - Opens Drawer */}
                        <button
                            onClick={onOpenCart}
                            aria-label="Shopping Cart"
                            className="relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-stone-200 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95 bg-stone-50/70"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {hasItem && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                    1
                                </span>
                            )}
                        </button>

                        {/* Order History - Opens list of user's past orders */}
                        <button
                            onClick={onOpenHistory}
                            aria-label="Order History"
                            title="Order History"
                            className="relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-stone-200 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95 bg-stone-50/70"
                        >
                            <History className="w-5 h-5" />
                        </button>

                        {/* Order Checklist - only for staff with Order_Checklist_In_portal_View */}
                        {showChecklist && (
                            <button
                                onClick={onOpenChecklist}
                                aria-label="Order Checklist"
                                title="Order Checklist"
                                className="relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-stone-200 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95 bg-stone-50/70"
                            >
                                <ClipboardCheck className="w-5 h-5" />
                            </button>
                        )}

                        {/* Export PDF - only for staff with Enable_Order_PDF_In_Portal */}
                        {showExportPDF && (
                            <button
                                onClick={onExportPDF}
                                aria-label="Export PDF"
                                title="Export PDF"
                                className="relative w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-stone-200 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-300 transition-all duration-200 hover:scale-105 active:scale-95 bg-stone-50/70"
                            >
                                <FileDown className="w-5 h-5" />
                            </button>
                        )}

                        {/* Employee Profile Pill - matches Reservation button placement */}
                        <div className="flex items-center gap-2 pl-0 sm:pl-2">
                            {/* <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {employee.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {order.isConfirmed ? (
                    <span className="text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 inline" /> Snack Ordered
                    </span>
                  ) : hasItem ? (
                    <span className="text-amber-600 font-semibold">1 in cart</span>
                  ) : (
                    '1 free item'
                  )}
                </span>
              </div> */}

                            <div
                                onClick={hasItem ? onOpenCart : undefined}
                                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full border transition-all cursor-pointer ${order.isConfirmed
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : hasItem
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-stone-100 border-stone-200 text-slate-800'
                                    }`}
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                                    {employee.name.charAt(0)}
                                </div>
                                <div className="hidden sm:block text-left pr-1">
                                    <p className="text-xs font-bold leading-tight">{employee.name}</p>
                                    {/* <p className="text-[10px] text-slate-500 leading-none">{employee.department}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
