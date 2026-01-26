import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Infirmière indépendante, Genève",
    content: "Je rentre enfin chez moi l'esprit tranquille ! Avant, je passais 2-3 heures chaque soir à rattraper mes annotations. Maintenant, tout est fait en temps réel. Ma qualité de vie a radicalement changé.",
    rating: 5,
    benefit: "2h économisées par jour",
  },
  {
    name: "Pierre Martin",
    role: "Infirmier à domicile, Lausanne",
    content: "L'IA comprend vraiment le langage médical suisse et rédige exactement comme je le ferais. Je copie directement dans mon logiciel en 1 clic. Je peux enfin profiter de mes soirées avec ma famille.",
    rating: 5,
    benefit: "Plus de stress",
  },
  {
    name: "Sophie Weber",
    role: "Infirmière indépendante, Zurich",
    content: "Je dictais en voiture entre deux visites et mes annotations sont prêtes quand j'arrive. Fini les week-ends passés à rattraper le retard ! Le ROI est incroyable pour seulement 125 CHF/mois.",
    rating: 5,
    benefit: "Week-ends libérés",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ils ont retrouvé leur tranquillité d'esprit
          </h2>
          <p className="text-xl text-muted-foreground">
            Des infirmiers suisses comme vous qui profitent enfin de leurs soirées
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">P</div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
              <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>
            <span className="text-sm font-semibold text-green-700">Plus de 100 infirmiers actifs</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Quote className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {testimonial.benefit}
                  </div>
                </div>
                <p className="text-card-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
