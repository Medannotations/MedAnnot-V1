import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Plus de 100 infirmiers nous font déjà confiance
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Retrouvez votre tranquillité d'esprit{" "}
            <span className="text-primary">dès ce soir</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Imaginez terminer votre journée sereinement, rentrer chez vous l'esprit tranquille,
            et profiter pleinement de votre soirée. C'est possible dès aujourd'hui.
          </p>

          {/* Benefits recap */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto py-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">2h</div>
              <div className="text-sm text-muted-foreground">économisées par jour</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">0 CHF</div>
              <div className="text-sm text-muted-foreground">pendant 7 jours d'essai</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">1 clic</div>
              <div className="text-sm text-muted-foreground">pour copier vos annots</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              size="xl"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm sm:text-xl px-8 sm:px-12 py-6 sm:py-8 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 w-full sm:w-auto"
              onClick={onGetStarted}
            >
              <span className="hidden sm:inline">🚀 Commencer mon essai gratuit maintenant</span>
              <span className="sm:hidden">🚀 Essai gratuit maintenant</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              ✓ Sans engagement • ✓ Résiliable à tout moment • ✓ Activation en 30 secondes
            </p>
            <div className="mt-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg py-3 px-6 inline-block">
              <p className="text-sm font-semibold text-yellow-800">
                ⏰ Profitez de votre soirée dès aujourd'hui au lieu de rédiger des annotations
              </p>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Données sécurisées • Conformité LPD suisse • Hébergement en Suisse</span>
          </div>
        </div>
      </div>
    </section>
  );
}
