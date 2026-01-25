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
            Un seul forfait. Tout inclus.
          </h2>
          <p className="text-xl text-muted-foreground">
            Toutes les fonctionnalités. Sans limitation.
          </p>
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
                <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                  {billingPeriod === "monthly" ? "189" : "1499"} CHF
                </div>
                <div className="text-lg text-muted-foreground">
                  {billingPeriod === "monthly" ? "par mois" : "par an"}
                </div>
                {billingPeriod === "yearly" && (
                  <div className="mt-3 text-green-600 font-semibold text-lg">
                    Soit 125 CHF/mois • Économisez 769 CHF ! 🎉
                  </div>
                )}
              </div>

              {/* Badge essai gratuit */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-700 mb-1">
                    ✅ 7 JOURS D'ESSAI GRATUIT
                  </div>
                  <div className="text-sm text-green-600">
                    Sans carte bancaire • Sans engagement
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-6 shadow-xl hover:shadow-2xl transition-all"
                onClick={onGetStarted}
              >
                Commencer mon essai gratuit de 7 jours
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Sans carte bancaire • Activation instantanée • 100% sécurisé 🔒
              </p>
            </CardFooter>
          </Card>
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
              <p className="text-sm font-medium text-foreground">Sans carte bancaire</p>
              <p className="text-xs text-muted-foreground">Pour l'essai gratuit</p>
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
