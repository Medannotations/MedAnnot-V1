import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp } from "lucide-react";

interface StickyMobileCTAProps {
  onGetStarted: () => void;
}

export function StickyMobileCTA({ onGetStarted }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Show sticky CTA after scrolling past hero section (approx 100px)
      setIsVisible(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 lg:hidden safe-area-pb">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                Essayez MedAnnot gratuitement
              </p>
              <p className="text-xs text-gray-500">
                7 jours • 0 CHF • Sans engagement
              </p>
            </div>
            <Button
              size="sm"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all touch-manipulation whitespace-nowrap"
            >
              Essai gratuit
              <Badge className="ml-2 bg-red-500 text-white text-xs animate-pulse">
                GRATUIT
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 lg:hidden transition-all transform hover:scale-110 touch-manipulation"
        aria-label="Retour en haut"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </>
  );
}