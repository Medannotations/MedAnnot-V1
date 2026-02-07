import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MapPin, Users, TrendingUp, Check, Clock } from "lucide-react";
import heroImage from "@/assets/hero-nurse-optimized.jpg";

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function Hero({ onGetStarted, onLogin }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background gradient - subtil et professionnel */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      
      {/* Decorative elements - plus légers */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8">
            {/* Social proof badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-md flex items-center gap-2">
                <Users className="w-4 h-4" />
                127 infirmiers romands
              </Badge>
              
              <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold text-sm">4.8/5</span>
                <span className="text-yellow-700 text-sm">- 89 avis</span>
              </div>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Hébergé en Suisse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Conforme LPD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>21x ROI</span>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Fini les soirées à rédiger vos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                annotations médicales
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              Dictez vos observations en 30 secondes. L'IA rédige des annotations professionnelles conformes aux standards suisses. Vous récupérez 2 heures par jour.
            </p>

            {/* CTA buttons - bien distincts */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base md:text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Essayer gratuitement 7 jours
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onLogin}
                className="w-full sm:w-auto bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-800 hover:text-blue-600 font-semibold px-8 py-6 h-auto rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                Se connecter
              </Button>
            </div>

            {/* Trust micro-copy */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                0 CHF aujourd'hui
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Annulation en 1 clic
              </span>
            </div>
          </div>
          
          {/* Right content - Hero image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 to-emerald-200/30 rounded-3xl blur-2xl" />
            <img 
              src={heroImage} 
              alt="Infirmière utilisant MedAnnot" 
              className="relative w-full max-w-md lg:max-w-none mx-auto rounded-2xl lg:rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              loading="eager"
            />
            
            {/* Floating card - temps gagné */}
            <div className="hidden lg:block absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
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

            {/* Floating card - utilisateurs */}
            <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
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
          </div>
        </div>
      </div>
    </section>
  );
}
