import { Button } from "@/components/ui/button";

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
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Mensuel
                </span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">149</span>
                  <span className="text-2xl font-medium text-gray-500 ml-1">CHF</span>
                  <span className="text-gray-500 ml-2">/ mois</span>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  Flexibilité maximale
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Idéal pour tester sur la durée
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sans engagement, résiliable à tout moment
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Toutes les fonctionnalités incluses
                </li>
              </ul>

              <Button
                onClick={onGetStarted}
                variant="outline"
                className="w-full py-6 text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Commencer l'essai gratuit
              </Button>
            </div>

            {/* Annual plan - RECOMMENDED */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-xl transform scale-100 md:scale-105">
              {/* Recommended badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg">
                  ⭐ Recommandé — Économisez 16%
                </span>
              </div>

              <div className="mb-6 pt-2">
                <span className="text-sm font-medium text-blue-200 uppercase tracking-wide">
                  Annuel
                </span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold">125</span>
                  <span className="text-2xl font-medium text-blue-200 ml-1">CHF</span>
                  <span className="text-blue-200 ml-2">/ mois</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-blue-200 text-sm">
                    soit 1'499 CHF/an
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold">
                    -24 CHF/mois
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>2 mois offerts</strong> par rapport au mensuel</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Même accès complet à toutes les fonctionnalités
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tranquillité pour toute l'année
                </li>
              </ul>

              <Button
                onClick={onGetStarted}
                className="w-full py-6 text-lg font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg"
              >
                🎯 Commencer l'essai gratuit
              </Button>
            </div>
          </div>

          {/* Included features */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Inclus dans les deux formules
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA micro-copy */}
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              🔒 Aucune carte bancaire requise. Annulation en 1 clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
