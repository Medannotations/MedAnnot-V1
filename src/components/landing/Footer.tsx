import { Shield, Lock, Stethoscope, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="relative bg-slate-900 border-t border-white/15 py-12 sm:py-16 overflow-hidden">
      {/* Background subtle pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative container mx-auto px-4">
        {/* Section principale */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Colonne 1 - À propos */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">MedAnnot</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                L'assistant IA qui économise 2h par jour aux infirmiers. 
                Annotations médicales complètes, observations à chaud, suivi des signes vitaux.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Conformité LPD suisse</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Données hébergées en Suisse</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Conçu et développé en Suisse</span>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Navigation rapide */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4 text-lg text-white">Navigation</h4>
              <ul className="space-y-1 text-white/70">
                <li>
                  <a href="#pricing" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                    Tarification
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                    Témoignages
                  </a>
                </li>
                <li>
                  <Link to="/app" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                    Commencer gratuitement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 - Support */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4 text-lg text-white">Support</h4>
              <ul className="space-y-3 text-white/70">
                <li>
                  <a href="mailto:contact@medannot.ch" className="hover:text-cyan-400 transition-colors hover:underline">
                    contact@medannot.ch
                  </a>
                </li>
                <li>
                  <span className="text-white/50 text-sm">
                    Disponible 7j/7
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-lg text-white">Légal</h4>
                <ul className="space-y-0 text-white/70 text-sm">
                  <li>
                    <Link to="/terms-of-service" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                      Conditions générales d'utilisation
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-sale" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                      Conditions générales de vente
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                      Politique de confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal-notice" className="inline-block py-2 min-h-[44px] flex items-center hover:text-cyan-400 transition-colors hover:underline touch-manipulation">
                      Mentions légales
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 pt-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-white/50">
              © {new Date().getFullYear()} MedAnnot. Tous droits réservés.
            </p>
            <p className="text-white/50">
              Solution dédiée aux infirmiers en Suisse
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
