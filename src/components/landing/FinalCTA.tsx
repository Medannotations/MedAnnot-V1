import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Clock icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Demain soir, vous pourriez avoir terminé vos annotations{" "}
            <span className="text-emerald-300">avant 18h</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            7 jours pour tester. Aucun engagement. Si MedAnnot ne change pas votre quotidien, vous n'avez rien perdu.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            size="xl"
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 min-h-[56px] rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow touch-manipulation"
          >
            <span className="mr-2">🚀</span>
            Démarrer mon essai gratuit
          </Button>

          {/* Micro-copy */}
          <p className="mt-6 text-blue-200 text-sm">
            Rejoignez les infirmiers qui ont choisi de reprendre le contrôle de leur temps.
          </p>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-blue-100">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              0 CHF pendant l'essai
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Conforme LPD
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Annulation en 1 clic
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
