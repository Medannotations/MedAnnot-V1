import { Clock, Smile, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Clock,
    title: "40 heures récupérées par mois",
    value: "40h",
    description: "Une semaine complète de travail économisée chaque mois",
    detail: "2h par jour × 20 jours = Plus de temps pour vous reposer",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Smile,
    title: "Vos soirées libérées",
    value: "100%",
    description: "Rentrez chez vous l'esprit tranquille, tout est déjà fait",
    detail: "Plus besoin de passer 2h chaque soir sur vos annotations",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: Brain,
    title: "IA spécialisée paramédical",
    value: "Expert",
    description: "Rédige comme un professionnel de santé expérimenté",
    detail: "Comprend le langage médical suisse et votre structure personnalisée",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Retrouvez votre équilibre de vie dès aujourd'hui
          </h2>
          <p className="text-xl text-muted-foreground">
            Des résultats concrets qui transforment votre quotidien
          </p>
        </div>

        {/* 3 cartes en grid qui prennent toute la largeur */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`bg-white border-2 ${benefit.borderColor} hover:shadow-2xl transition-all duration-300 group`}
            >
              <CardContent className="p-8">
                <div className={`w-20 h-20 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <benefit.icon className={`w-10 h-10 ${benefit.color}`} />
                </div>

                <div className={`text-5xl font-bold ${benefit.color} mb-4`}>
                  {benefit.value}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>

                <p className="text-base text-muted-foreground mb-3 leading-relaxed">
                  {benefit.description}
                </p>

                <p className="text-sm text-muted-foreground italic">
                  {benefit.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator adapté */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
            <CardContent className="p-10">
              <div className="text-center space-y-6">
                <h3 className="text-3xl font-bold text-foreground">
                  40 heures par mois pour vous reposer
                </h3>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Imaginez récupérer <strong className="text-foreground">une semaine complète chaque mois</strong> pour décompresser,
                  vous reposer et profiter pleinement de votre vie personnelle.
                </p>

                <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto mt-8">
                  <div className="text-6xl font-bold text-primary mb-3">40h</div>
                  <div className="text-lg text-muted-foreground mb-4">de repos récupéré par mois</div>
                  <div className="text-sm text-muted-foreground">
                    = <strong className="text-foreground">5 jours de 8h</strong> pour vider l'esprit et recharger vos batteries
                  </div>
                </div>

                <p className="text-base text-muted-foreground mt-8 italic">
                  Plus besoin de sacrifier vos soirées et week-ends pour rattraper vos annotations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
