import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PricingProps {
  onGetStarted: () => void;
}

const includedFeatures = [
  "Annotations illimitées",
  "Patients illimités",
  "Stockage illimité",
  "Export PDF/Word",
  "Personnalisation complète",
  "Support prioritaire",
  "Mises à jour incluses",
  "Données sécurisées (LPD)",
  "Résiliable à tout moment",
  "Remboursement sous 30 jours",
];

export function Pricing({ onGetStarted }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Un investissement qui se rembourse en quelques jours
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Toutes les fonctionnalités. Aucune limitation. Un seul abonnement.
          </p>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 inline-block">
            <p className="text-lg font-semibold text-green-700">
              40 heures économisées/mois = plus de temps facturable ou personnel
            </p>
          </div>
        </div>

        {/* Toggle Mensuel/Annuel */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted rounded-lg p-1 border border-border">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                billingPeriod === "monthly"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-3 rounded-lg transition-all font-medium relative ${
                billingPeriod === "yearly"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                -45%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="relative bg-card border-2 border-primary shadow-2xl">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mb-6">
                {billingPeriod === "monthly" ? (
                  <>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      189 CHF
                    </div>
                    <div className="text-lg text-muted-foreground">
                      par mois
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <span className="text-2xl text-muted-foreground line-through">2268 CHF</span>
                    </div>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      1499 CHF
                    </div>
                    <div className="text-lg text-muted-foreground mb-3">
                      par an
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl py-3 px-6 rounded-xl inline-block">
                      Soit 125 CHF/mois • Économisez 769 CHF/an !
                    </div>
                  </>
                )}
              </div>

              {/* Badge essai gratuit */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-6 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    🎁 7 JOURS D'ESSAI GRATUIT
                  </div>
                  <div className="text-base text-green-600 font-medium mb-3">
                    À 0 CHF • Sans carte bancaire • Sans engagement
                  </div>
                  <div className="text-sm text-green-700 bg-white/60 rounded-lg py-2 px-4 inline-block">
                    Testez toutes les fonctionnalités. Résiliez quand vous voulez.
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <ul className="grid sm:grid-cols-2 gap-3">
                {includedFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="px-8 pb-8 flex-col gap-4">
              <Button
                size="xl"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-7 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={onGetStarted}
              >
                🚀 Commencer à économiser 2h par jour - Essai gratuit
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                ✓ Activation en 30 secondes • ✓ Sans carte bancaire • ✓ Sans engagement • ✓ 100% sécurisé
              </p>
              <div className="mt-2 text-center text-sm text-foreground font-medium bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-4">
                ⏰ Profitez de vos soirées dès ce soir !
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* ROI Calculator Card */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-foreground">
              Votre retour sur investissement
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm text-muted-foreground mb-2">Temps économisé par mois</div>
                <div className="text-4xl font-bold text-primary mb-1">40 heures</div>
                <div className="text-sm text-muted-foreground">soit une semaine complète de travail</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm text-muted-foreground mb-2">Coût réel par heure gagnée</div>
                <div className="text-4xl font-bold text-primary mb-1">3.10 CHF</div>
                <div className="text-sm text-muted-foreground">en formule annuelle (125 CHF/mois ÷ 40h)</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-foreground">
                Si votre temps vaut au moins 3 CHF/heure, MedAnnot est déjà rentable.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Sans compter la tranquillité d'esprit et la qualité de vie retrouvée.
              </p>
            </div>
          </div>
        </div>

        {/* Trust signals supplémentaires */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Sans engagement</p>
              <p className="text-xs text-muted-foreground">Résiliable en 1 clic</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-foreground">7 jours d'essai à 0 CHF</p>
              <p className="text-xs text-muted-foreground">Sans carte bancaire</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Satisfait ou remboursé</p>
              <p className="text-xs text-muted-foreground">30 jours garantis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
