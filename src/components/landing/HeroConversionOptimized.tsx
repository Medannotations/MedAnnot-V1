import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MapPin, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-nurse-optimized.jpg";

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function HeroOptimized({ onGetStarted, onLogin }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-500" />
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8">
            {/* URGENT: Enhanced social proof badges - ABOVE THE FOLD */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-fade-in-up">
              {/* Primary trust badge */}
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-2">
                <Users className="w-4 h-4" />
                127 infirmiers romands nous font confiance
              </Badge>
              
              {/* Rating badge */}
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 border-yellow-200 px-4 py-2 text-sm font-bold flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                4.8/5 étoiles - 89 avis
              </Badge>
            </div>

            {/* Secondary trust row */}
            <div className="flex flex-wrap items-center gap-4 text-sm animate-fade-in-up animation-delay-100">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Hébergé en Suisse</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Conforme LPD</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span>21x ROI garanti</span>
              </div>
            </div>
            
            {/* Enhanced headline with emotional trigger */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up animation-delay-200">
              Fini les soirées à rédiger vos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                annotations médicales
              </span>
            </h1>

            {/* Optimized subhead with pain point */}
            <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed animate-fade-in-up animation-delay-300">
              Dictez vos observations en 30 secondes après chaque visite. L'IA rédige des annotations professionnelles, conformes aux standards suisses. Vous récupérez 2 heures par jour.
            </p>

            {/* Enhanced CTA with urgency */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-400">
              <Button
                size="xl"
                onClick={onGetStarted}
                className="relative w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 min-h-[48px] rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all animate-pulse-glow touch-manipulation"
              >
                <span className="mr-2">🎯</span>
                Essayer gratuitement 7 jours
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs animate-bounce">
                  MAINTENANT
                </Badge>
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={onLogin}
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold px-6 md:px-8 py-4 md:py-6 min-h-[48px] rounded-xl transition-all touch-manipulation"
              >
                Se connecter
              </Button>
            </div>

            {/* Enhanced trust micro-copy with guarantees */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 animate-fade-in-up animation-delay-500">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                0 CHF pendant l'essai
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Annulation en 1 clic
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                14 jours sans engagement
              </span>
            </div>
          </div>
          
          {/* Right content - Hero image with enhanced floating elements */}
          <div className="relative animate-fade-in animation-delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl animate-pulse" />
            <img 
              src={heroImage} 
              alt="Infirmière utilisant MedAnnot - Gain de temps garanti" 
              className="relative w-full max-w-md lg:max-w-none mx-auto rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              loading="eager"
            />
            
            {/* Enhanced floating cards with social proof */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2h</div>
                  <div className="text-sm text-gray-500">gagnées/jour</div>
                </div>
              </div>
            </div>

            {/* NEW: Social proof floating card */}
            <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float animation-delay-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">127+</div>
                  <div className="text-xs text-gray-500">infirmiers actifs</div>
                </div>
              </div>
            </div>

            {/* NEW: Rating floating card */}
            <div className="hidden lg:block absolute top-1/2 -right-6 bg-white rounded-2xl shadow-xl p-3 border border-gray-100 animate-float animation-delay-700">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">4.8/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}