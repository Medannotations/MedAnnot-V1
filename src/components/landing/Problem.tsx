import { Clock, ArrowRight, Zap } from "lucide-react";

export function Problem() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Problem */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-destructive-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Le problème</h3>
            <p className="text-muted-foreground">
              Vous passez des heures précieuses à rédiger vos annotations. Temps perdu en 
              administration au lieu d'être auprès de vos patients.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground" />
                Rédaction manuelle chronophage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground" />
                Risque d'oublis ou d'erreurs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground" />
                Stress administratif quotidien
              </li>
            </ul>
          </div>
          
          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          {/* Solution */}
          <div className="bg-secondary/20 border border-secondary/30 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">La solution</h3>
            <p className="text-muted-foreground">
              Dictez simplement vos observations. Medannot génère automatiquement 
              des annotations professionnelles, structurées selon vos préférences.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Gain de temps immédiat
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Documentation complète et structurée
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Plus de temps pour vos patients
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
