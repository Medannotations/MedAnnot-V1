import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Prêt à économiser 2 heures par jour ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez les centaines d'infirmiers qui ont déjà transformé leur pratique quotidienne
          </p>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button
              size="xl"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all"
              onClick={onGetStarted}
            >
              Essayer gratuitement pendant 7 jours
            </Button>
            <p className="text-sm text-muted-foreground">
              Sans carte bancaire • Sans engagement • Activation immédiate
            </p>
          </div>

          <div className="pt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">100% sécurisé et conforme LPD suisse</span>
          </div>
        </div>
      </div>
    </section>
  );
}
