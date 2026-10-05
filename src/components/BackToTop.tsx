import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 350;
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll to top"
      className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 bg-stone-900/90 hover:bg-red-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in group flex items-center gap-1.5"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="hidden sm:inline text-xs font-bold pr-1">Top</span>
    </button>
  );
};
