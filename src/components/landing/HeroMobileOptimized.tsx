import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MapPin, Users, TrendingUp, ChevronUp } from "lucide-react";
import heroImage from "@/assets/hero-nurse-optimized.jpg";

interface HeroMobileProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function HeroMobileOptimized({ onGetStarted, onLogin }: HeroMobileProps) {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Show sticky CTA after scrolling past hero section
      setShowStickyCTA(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
        
        {/* Mobile-optimized decorative elements */}
        <div className="absolute top-10 left-5 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-5 w-60 h-60 bg-emerald-200 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-500" />
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Left content - MOBILE FIRST */}
            <div className="space-y-4 md:space-y-6">
              {/* Mobile-optimized trust badges */}
              <div className="flex flex-wrap items-center gap-2 animate-fade-in-up">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  127+ infirmiers
                </Badge>
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 border-yellow-200 px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  4.8/5 (89 avis)
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700 px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Suisse
                </Badge>
              </div>

              {/* Mobile-optimized headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-fade-in-up animation-delay-100">
                Fini les soirées à rédiger vos{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  annotations
                </span>
              </h1>

              {/* Mobile-optimized subhead */}
              <p className="text-base md:text-lg text-gray-600 leading-relaxed animate-fade-in-up animation-delay-200">
                Dictez vos observations en 30 secondes. L'IA rédige des annotations professionnelles. Vous récupérez 2 heures par jour.
              </p>

              {/* Mobile-optimized CTA */}
              <div className="flex flex-col gap-3 animate-fade-in-up animation-delay-300">
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all touch-manipulation"
                >
                  <span className="mr-2">🎯</span>
                  Essai gratuit 7 jours
                  <Badge className="ml-2 bg-red-500 text-white text-xs animate-pulse">
                    GRATUIT
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onLogin}
                  className="w-full border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold py-4 rounded-xl transition-all touch-manipulation"
                >
                  J'ai déjà un compte
                </Button>
              </div>

              {/* Mobile trust indicators */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Conforme LPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>21x ROI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Données en Suisse</span>
                </div>
              </div>
            </div>
            
            {/* Right content - Mobile-optimized image */}
            <div className="relative animate-fade-in animation-delay-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-2xl blur-2xl animate-pulse" />
              <img 
                src={heroImage} 
                alt="Infirmière MedAnnot - Gain de temps" 
                className="relative w-full max-w-sm mx-auto rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl hover:shadow-2xl transition-shadow duration-300"
                loading="eager"
              />
              
              {/* Mobile-optimized floating elements */}
              <div className="absolute -bottom-4 -left-2 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">2h</div>
                    <div className="text-xs text-gray-500">par jour</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 bg-white rounded-xl shadow-lg p-2 border border-gray-100 animate-float animation-delay-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">127+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY CTA - Mobile optimized */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 lg:hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Commencez votre essai gratuit
                </p>
                <p className="text-xs text-gray-500">
                  7 jours • Sans engagement • 0 CHF
                </p>
              </div>
              <Button
                size="sm"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all touch-manipulation"
              >
                Essayer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {showStickyCTA && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 lg:hidden transition-all transform hover:scale-110"
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}