import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StickyMobileCTAProps {
  onGetStarted: () => void;
}

export function StickyMobileCTA({ onGetStarted }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(true); // FORCE VISIBLE FOR TESTING
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      
      // Show CTA after scrolling 100px, hide near bottom
      setIsVisible(scrollTop > 100 && scrollTop < docHeight - 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // DEBUG: Always show for testing - remove in production
  console.log('StickyMobileCTA rendered, isVisible:', isVisible);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} lg:hidden`}>
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* CTA Container - ENHANCED VISIBILITY */}
      <div className="bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex-1">
            <div className="text-xs text-emerald-600 font-bold mb-1">
              🔥 127+ infirmiers actifs
            </div>
            <div className="text-sm text-gray-800 font-semibold">
              Commencer votre essai gratuit
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <span className="mr-2">🎯</span>
            Essai gratuit
          </Button>
        </div>
      </div>
    </div>
  );
}