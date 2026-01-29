import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nurse-optimized.jpg";

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function Hero({ onGetStarted, onLogin }: HeroProps) {
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
            {/* Badge gratuit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Pour infirmiers indépendants suisses
              </div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg">
                0 CHF pour commencer
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up animation-delay-100">
              Retrouvez{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                2 heures par jour
              </span>{" "}
              pour vos patients
            </h1>

            <p className="text-base md:text-xl text-gray-600 max-w-xl leading-relaxed animate-fade-in-up animation-delay-200">
              Dictez vos observations après chaque visite. L'IA rédige des annotations professionnelles en quelques secondes. Vous copiez-collez dans votre logiciel habituel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-300">
              <Button
                size="xl"
                onClick={onGetStarted}
                className="relative w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 min-h-[48px] rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all animate-pulse-glow touch-manipulation"
              >
                <span className="mr-2">🎯</span>
                Essayer gratuitement 7 jours
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

            {/* Trust micro-copy */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 animate-fade-in-up animation-delay-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sans carte bancaire
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Conforme LPD
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Annulation en 1 clic
              </span>
            </div>
          </div>
          
          {/* Right content - Hero image */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl animate-pulse" />
            <img 
              src={heroImage} 
              alt="Infirmière utilisant MedAnnot" 
              className="relative w-full max-w-md lg:max-w-none mx-auto rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              loading="eager"
            />
            
            {/* Floating card - Time saved */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2h</div>
                  <div className="text-sm text-gray-500">économisées/jour</div>
                </div>
              </div>
            </div>

            {/* Floating card - Fast annotation */}
            <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-float animation-delay-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">&lt; 30s</div>
                  <div className="text-xs text-gray-500">par annotation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
