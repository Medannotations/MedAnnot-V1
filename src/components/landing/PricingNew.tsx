import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingProps {
  onGetStarted: () => void;
}

const includedFeatures = [
  "Dictée vocale illimitée",
  "Génération d'annotations illimitée",
  "Tous les templates disponibles",
  "Historique complet",
  "Support par email prioritaire",
  "Mises à jour automatiques",
];

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section id="pricing" className="py-20 md:py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Investissez 5 minutes par jour.{" "}
            <span className="text-blue-600">Récupérez 2 heures.</span>
          </h2>
          <p className="text-xl text-gray-600">
            40 heures gagnées par mois. Combien vaut votre temps libre?
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly plan */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Mensuel
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-gray-900">149</span>
                <span className="text-xl text-gray-600">CHF/mois</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Idéal pour tester sur la durée
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {includedFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={onGetStarted}
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-2 hover:bg-gray-50"
            >
              Commencer mon essai gratuit
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Sans engagement, résiliable à tout moment
            </p>
          </div>

          {/* Annual plan - Recommended */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl text-white">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                Recommandé
              </div>
            </div>

            <div className="text-center mb-8 pt-4">
              <h3 className="text-xl font-semibold text-blue-100 mb-4">
                Annuel
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">1'499</span>
                <span className="text-xl text-blue-200">CHF/an</span>
              </div>
              <p className="text-sm text-blue-200 mt-2">
                Soit 125 CHF/mois — économisez 289 CHF
              </p>
              <div className="inline-block bg-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg mt-4">
                2 mois offerts
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {includedFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  <span className="text-blue-50">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={onGetStarted}
              className="w-full py-6 text-lg font-bold bg-white text-blue-600 hover:bg-blue-50"
            >
              Commencer mon essai gratuit de 7 jours
            </Button>
            <p className="text-center text-sm text-blue-200 mt-3">
              Aucune carte bancaire requise. Annulation en 1 clic.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            Sans engagement
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            7 jours d'essai gratuit
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            Satisfait ou remboursé
          </span>
        </div>
      </div>
    </section>
  );
}
