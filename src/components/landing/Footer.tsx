import { Heart, Shield, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-foreground to-slate-900 text-background py-16">
      <div className="container mx-auto px-4">
        {/* Section principale */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Colonne 1 - À propos */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">MedAnnot</h3>
              <p className="text-background/80 leading-relaxed">
                L'assistant IA qui économise 2h par jour aux infirmiers indépendants suisses.
              </p>
              <div className="flex items-center gap-2 text-background/70 text-sm">
                <Shield className="w-4 h-4" />
                <span>Conformité LPD suisse</span>
              </div>
              <div className="flex items-center gap-2 text-background/70 text-sm">
                <Lock className="w-4 h-4" />
                <span>Données hébergées en Suisse</span>
              </div>
            </div>

            {/* Colonne 2 - Navigation rapide */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Navigation</h4>
              <ul className="space-y-3 text-background/80">
                <li>
                  <a href="#pricing" className="hover:text-background transition-colors hover:underline">
                    Tarification
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-background transition-colors hover:underline">
                    Témoignages
                  </a>
                </li>
                <li>
                  <a href="/app" className="hover:text-background transition-colors hover:underline">
                    Se connecter
                  </a>
                </li>
                <li>
                  <a href="/signup" className="hover:text-background transition-colors hover:underline">
                    Commencer gratuitement
                  </a>
                </li>
              </ul>
            </div>

            {/* Colonne 3 - Support */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-background/80">
                <li>
                  <a href="mailto:contact@medannot.ch" className="hover:text-background transition-colors hover:underline">
                    contact@medannot.ch
                  </a>
                </li>
                <li>
                  <span className="text-background/60 text-sm">
                    Disponible 7j/7
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-lg">Légal</h4>
                <ul className="space-y-2 text-background/80 text-sm">
                  <li>
                    <a href="#" className="hover:text-background transition-colors hover:underline">
                      Conditions générales
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-background transition-colors hover:underline">
                      Politique de confidentialité
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-background/20 pt-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-background/70">
              © {new Date().getFullYear()} MedAnnot. Tous droits réservés.
            </p>
            <p className="text-background/70 flex items-center gap-2">
              Fait avec <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> pour les infirmiers suisses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
