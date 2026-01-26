import { Clock, Heart, Calendar, TrendingUp, Smile, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Clock,
    title: "2h économisées chaque jour",
    value: "120 min",
    description: "Soit 40 heures par mois récupérées pour vous",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Tranquillité d'esprit totale",
    value: "100%",
    description: "Rentrez chez vous l'esprit léger, tout est fait",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Smile,
    title: "Vos soirées vous appartiennent",
    value: "7j/7",
    description: "Déconnectez vraiment et profitez de votre vie personnelle",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Award,
    title: "Qualité professionnelle garantie",
    value: "IA Expert",
    description: "Rédaction spécialisée paramédical, comme un corps médical",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Calendar,
    title: "Plus d'oublis, jamais",
    value: "0 stress",
    description: "Tout est enregistré et archivé automatiquement",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: TrendingUp,
    title: "Productivité maximale",
    value: "+200%",
    description: "En 1 clic, copiez dans votre logiciel habituel",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce que MedAnnot vous apporte concrètement
          </h2>
          <p className="text-xl text-muted-foreground">
            Des bénéfices tangibles dès le premier jour d'utilisation
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-card border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>

                <div className={`text-3xl font-bold ${benefit.color} mb-2`}>
                  {benefit.value}
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {benefit.title}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Calculez votre retour sur investissement
                </h3>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6">
                    <div className="text-4xl font-bold text-primary mb-2">2h</div>
                    <div className="text-sm text-muted-foreground">économisées par jour</div>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6">
                    <div className="text-4xl font-bold text-primary mb-2">40h</div>
                    <div className="text-sm text-muted-foreground">récupérées par mois</div>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6">
                    <div className="text-4xl font-bold text-primary mb-2">480h</div>
                    <div className="text-sm text-muted-foreground">gagnées par an</div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mt-6">
                  <strong className="text-foreground">480 heures par an</strong> = 20 jours complets récupérés
                </p>
                <p className="text-xl font-semibold text-primary">
                  Pour seulement 125 CHF/mois (en annuel) !
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
