import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, TrendingUp, Award } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export function PricingOptimized({ onGetStarted }: PricingProps) {
  const plans = [
    {
      name: "Mensuel",
      price: "149",
      period: "mois",
      description: "Idéal pour tester sur la durée",
      popular: false,
      features: [
        { text: "Dictée vocale illimitée", included: true },
        { text: "Génération d'annotations illimitée", included: true },
        { text: "Tous les templates disponibles", included: true },
        { text: "Historique complet", included: true },
        { text: "Support par email", included: true },
        { text: "Mises à jour automatiques", included: true },
        { text: "Sans engagement", included: true },
      ],
      cta: "Commencer l'essai",
      savings: null,
    },
    {
      name: "Annuel",
      price: "1'499",
      period: "an",
      description: "L'offre la plus populaire",
      popular: true,
      features: [
        { text: "Dictée vocale illimitée", included: true },
        { text: "Génération d'annotations illimitée", included: true },
        { text: "Tous les templates disponibles", included: true },
        { text: "Historique complet", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Mises à jour automatiques", included: true },
        { text: "2 mois offerts", included: true, highlight: true },
      ],
      cta: "Économiser 289 CHF",
      savings: "289 CHF économisés",
      pricePerMonth: "125 CHF/mois",
    },
  ];

  // NEW: ROI calculation
  const roiData = {
    hourlyRate: 80, // CHF/hour for Swiss nurses
    hoursSavedPerMonth: 40,
    monthlyValue: 3200,
    plans: [
      { name: "Mensuel", cost: 149, roi: 21 },
      { name: "Annuel", cost: 125, roi: 26 },
    ],
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-blue-50" id="pricing">
      <div className="container mx-auto px-4">
        {/* Enhanced header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Retour sur investissement: 21x</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Investissez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              5 minutes par jour
            </span>
            . Récupérez 2 heures.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            40 heures gagnées par mois. Combien vaut votre temps libre?
          </p>
        </div>

        {/* NEW: ROI Calculator */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">Calcul de votre retour sur investissement</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">40h</div>
                <div className="text-sm text-gray-600">économisées/mois</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">3,200 CHF</div>
                <div className="text-sm text-gray-600">valeur de votre temps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">21x</div>
                <div className="text-sm text-gray-600">retour sur investissement</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>Basé sur:</strong> 2h économisées par jour × 20 jours ouvrables × 80 CHF/heure
              </p>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-emerald-500 bg-white shadow-2xl scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white px-4 py-1 text-sm font-bold">
                      <Clock className="w-3 h-3 mr-1" />
                      OFFRE POPULAIRE
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-lg text-gray-600 ml-1">CHF/{plan.period}</span>
                  </div>
                  
                  {plan.pricePerMonth && (
                    <p className="text-emerald-600 font-medium mb-2">{plan.pricePerMonth}</p>
                  )}
                  
                  {plan.savings && (
                    <p className="text-emerald-600 font-bold text-sm md:text-base">💰 {plan.savings}</p>
                  )}
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm md:text-base ${feature.included ? "text-gray-900" : "text-gray-500"} ${feature.highlight ? "font-bold text-emerald-700" : ""}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={`w-full font-bold text-base md:text-lg py-3 md:py-4 ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      : "bg-white border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-700"
                  }`}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Comparison with alternatives */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              MedAnnot vs. Les alternatives
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Solution</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Coût mensuel</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Temps économisé</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Qualité</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-emerald-700">MedAnnot</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">125 CHF</td>
                    <td className="py-3 px-4 text-center text-emerald-700">40h/mois</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Assistant médical</td>
                    <td className="py-3 px-4 text-center">3,200 CHF</td>
                    <td className="py-3 px-4 text-center">40h/mois</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {[...Array(4)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Logiciel de dictée</td>
                    <td className="py-3 px-4 text-center">35 CHF</td>
                    <td className="py-3 px-4 text-center">5h/mois</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        {[...Array(3)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-sm text-gray-600 text-center mt-4">
              MedAnnot offre le meilleur rapport qualité-prix pour les infirmiers indépendants
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Prêt à récupérer 2 heures par jour?
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Commencer mon essai gratuit
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            7 jours gratuits • Aucune carte bancaire requise • Annulation en 1 clic
          </p>
        </div>
      </div>
    </section>
  );
}