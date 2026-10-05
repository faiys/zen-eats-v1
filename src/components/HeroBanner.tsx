import React from 'react';
import { ZohoImage } from './ZohoImage';
import { Sparkles } from 'lucide-react';
import heroBg from '../assets/images/hero_friday_spread_1790948481132.jpg';
import { OrderState } from '../hooks/useOrder';

interface HeroBannerProps {
    order: OrderState;
    onOpenCart: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
    order,
    onOpenCart,
}) => {
    return (
        <div className="relative overflow-hidden bg-stone-900 py-12 md:py-16 text-white">
            {/* Background Image with DreamsFood overlay */}
            <img
                src={heroBg}
                alt="Delicious Friday Food Feast"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-stone-950/70 to-black/85" />

            {/* Decorative warm ambient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/25 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                {/* Title matching DreamsFood "Product" header style */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-white mb-4 drop-shadow-sm animate-fade-in">
                    Friday Snacks
                </h1>

                {/* Clean Office treat badge */}
                <div className="inline-flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-xs font-medium text-stone-300 animate-float-slow">
                    <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Weekly Perk
                    </span>
                    <span className="text-stone-400">›</span>
                    <span className="text-white font-semibold">Choose Your Friday Treat</span>
                </div>

                {/* Informational rule pill */}
                <p className="mt-4 text-stone-300 text-xs sm:text-sm max-w-xl text-center leading-relaxed">
                    Office policy: <strong className="text-amber-300 font-semibold">1 item limit per employee</strong>.
                    Select your favorite snack below.
                </p>

                {/* Active Selection Banner if employee has selected something */}
                {order.selectedItem && (
                    <div className="mt-6 w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left animate-fade-in shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                                <ZohoImage
                                    src={order.selectedItem.images[0]}
                                    alt={order.selectedItem.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                                        {order.isConfirmed ? '✓ Order Confirmed' : '• In Your Cart'}
                                    </span>
                                    <span className="text-white/40">|</span>
                                    <span className="text-xs text-stone-300">{order.selectedItem.portion}</span>
                                </div>
                                <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                                    {order.selectedItem.name}
                                </h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                                onClick={onOpenCart}
                                className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition-all active:scale-95"
                            >
                                {order.isConfirmed ? 'View Receipt' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
