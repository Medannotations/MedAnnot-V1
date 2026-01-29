import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Demain soir, vous pourriez avoir terminé vos annotations{" "}
            <span className="text-emerald-300">avant 18h</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            7 jours pour tester. Aucun engagement. Si MedAnnot ne change pas votre quotidien, vous n'avez rien perdu.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              onClick={onGetStarted}
              size="xl"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all group"
            >
              Démarrer mon essai gratuit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Micro-copy */}
          <p className="text-blue-200 text-sm">
            Rejoignez les infirmiers qui ont choisi de reprendre le contrôle de leur temps.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sans carte bancaire
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Conforme LPD
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Annulation en 1 clic
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
