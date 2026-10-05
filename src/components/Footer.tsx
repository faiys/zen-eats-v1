import React from 'react';
import { Sparkles, MapPin, Clock, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 pt-12 pb-16 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    {/* Col 1: Brand & Office program */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                                🍱
                            </div>
                            <span className="text-xl font-black font-['Outfit'] tracking-tight text-white">
                                ZenEats <span className="text-red-500 font-light">| Friday</span>
                            </span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">
                            Internal Friday snack distribution system. Providing fresh, hot, and hygienic treats to keep team spirits soaring every week.
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-stone-800/80 px-2.5 py-1 rounded-full border border-stone-700">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Complimentary perk by People Team</span>
                        </div>
                    </div>

                    {/* Col 2: Ordering Rules */}
                    <div className="space-y-2 text-xs">
                        <h4 className="text-sm font-bold font-['Outfit'] text-white uppercase tracking-wider mb-2">
                            Friday Guidelines
                        </h4>
                        <p className="text-stone-400">• Strict limit of 1 snack item per employee.</p>
                        <p className="text-stone-400">• Orders lock every Friday.</p>
                        <p className="text-stone-400">• Pickup is hot & fresh.</p>
                        <p className="text-stone-400">• Changing choices unlocked.</p>
                    </div>

                    {/* Col 3: Pickup Location */}
                    <div className="space-y-2.5 text-xs">
                        <h4 className="text-sm font-bold font-['Outfit'] text-white uppercase tracking-wider mb-2">
                            Pickup Point
                        </h4>
                        <div className="flex items-start gap-2 text-stone-400">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Floor 1 Zentegra/NMG</span>
                        </div>
                        <div className="flex items-start gap-2 text-stone-400">
                            <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>Service Hours: 7:00 PM – 8:30 PM</span>
                        </div>
                    </div>

                    {/* Col 4: Pantry Contact */}
                    <div className="space-y-2.5 text-xs">
                        <h4 className="text-sm font-bold font-['Outfit'] text-white uppercase tracking-wider mb-2">
                            Pantry Desk
                        </h4>
                        <div className="flex items-center gap-2 text-stone-400">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>Not yet assign (Pantry Manager)</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>Not yet</span>
                        </div>
                    </div>
                </div>

                {/* Bottom copyright row */}
                <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
                    <p>© 2026 ZenEats &bull; Friday Snacks</p>
                    {/* <div className="flex gap-4">
                        <a href="#rules" className="hover:text-stone-300">Snack Policy</a>
                        <a href="#dietary" className="hover:text-stone-300">Allergen Info</a>
                        <a href="#feedback" className="hover:text-stone-300">Suggest a Snack</a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};
