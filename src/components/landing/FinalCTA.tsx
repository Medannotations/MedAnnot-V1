import { Button } from "@/components/ui/button";
import { Clock, Sparkles, Check, ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/30 to-teal-950/20" />
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Clock icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 backdrop-blur-sm">
              <Clock className="w-10 h-10 text-cyan-400" />
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Demain soir, vous pourriez avoir terminé vos annotations{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              avant 18h
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            7 jours pour tester. Aucun engagement. Si MedAnnot ne change pas votre quotidien, vous n'avez rien perdu.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 touch-manipulation"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Démarrer mon essai gratuit
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Micro-copy */}
          <p className="mt-6 text-white/50 text-sm">
            Rejoignez les infirmiers qui ont choisi de reprendre le contrôle de leur temps.
          </p>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/60">
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-cyan-400" />
              </div>
              0 CHF pendant l'essai
            </span>
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-teal-400" />
              </div>
              Conforme LPD
            </span>
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              Annulation en 1 clic
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
