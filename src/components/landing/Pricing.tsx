import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PricingProps {
  onGetStarted: () => void;
}

const plans = [
  {
    name: "Gratuit",
    price: "0",
    description: "Parfait pour découvrir Medannot",
    features: [
      "5 annotations par mois",
      "3 patients maximum",
      "Structure d'annotation de base",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Professionnel",
    price: "49",
    description: "Pour les infirmiers actifs",
    features: [
      "Annotations illimitées",
      "Patients illimités",
      "Structure personnalisable",
      "Exemples d'apprentissage IA",
      "Historique complet",
      "Export PDF",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    popular: true,
  },
  {
    name: "Équipe",
    price: "89",
    description: "Pour les cabinets et groupements",
    features: [
      "Tout du plan Pro",
      "Jusqu'à 5 utilisateurs",
      "Partage de patients",
      "Administration centralisée",
      "Statistiques d'équipe",
      "Formation personnalisée",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

export function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tarification simple et transparente
          </h2>
          <p className="text-xl text-muted-foreground">
            Choisissez le plan adapté à votre pratique. Pas de frais cachés.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-card border-border/50 ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-card-foreground">CHF {plan.price}</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-card-foreground">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "hero" : "outline"}
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
