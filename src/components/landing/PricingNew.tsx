import { Button } from "@/components/ui/button";
import { Check, Clock, Shield, Sparkles } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  const includedFeatures = [
    "Dictée vocale illimitée",
    "Génération d'annotations illimitée",
    "Tous les templates disponibles",
    "Historique complet",
    "Support par email prioritaire",
    "Mises à jour automatiques",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="pricing">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Tarification
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Investissez 5 minutes par jour.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Récupérez 2 heures.
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            40 heures gagnées par mois. Combien vaut votre temps libre?
          </p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Mensuel
                  </span>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">149</span>
                  <span className="text-2xl font-medium text-gray-500 ml-1">CHF</span>
                  <span className="text-gray-500 ml-2">/mois</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  Sans engagement, résiliable à tout moment
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Annotations illimitées
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Patients illimités
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  7 jours d'essai gratuit
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  Sans engagement
                </li>
              </ul>

              <Button
                onClick={onGetStarted}
                variant="outline"
                className="w-full py-4 md:py-6 min-h-[48px] text-base md:text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all touch-manipulation"
              >
                Commencer l'essai gratuit
              </Button>
            </div>

            {/* Annual plan - RECOMMENDED */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl transform scale-100 md:scale-105 flex flex-col">
              {/* Recommended badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  RECOMMANDÉ — Économisez 16%
                </span>
              </div>

              <div className="mb-6 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-200" />
                  <span className="text-sm font-medium text-blue-200 uppercase tracking-wide">
                    Annuel
                  </span>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold">125</span>
                  <span className="text-2xl font-medium text-blue-200 ml-1">CHF</span>
                  <span className="text-blue-200 ml-2">/mois</span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-blue-200 text-sm">
                    Engagement 12 mois — paiement mensuel
                  </p>
                  <p className="text-emerald-300 text-sm font-medium">
                    Économisez 288 CHF/an
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  <span><strong>Tout inclus</strong> du plan mensuel</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  7 jours d'essai gratuit
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  Meilleur rapport qualité-prix
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  Support prioritaire
                </li>
              </ul>

              <Button
                onClick={onGetStarted}
                className="w-full py-4 md:py-6 min-h-[48px] text-base md:text-lg font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg touch-manipulation"
              >
                Commencer l'essai gratuit
              </Button>
            </div>
          </div>

          {/* Payment info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              💡 Les deux plans sont payés <strong>mensuellement</strong>. Le plan Annuel vous engage sur 12 mois avec paiement échelonné.
            </p>
          </div>

          {/* Included features */}
          <div className="mt-8 md:mt-12 bg-gray-50 rounded-2xl p-5 md:p-8">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 text-center">
              Inclus dans les deux formules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 py-1">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA micro-copy */}
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              🔒 Aucune carte bancaire requise pour l'essai. Annulation en 1 clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
