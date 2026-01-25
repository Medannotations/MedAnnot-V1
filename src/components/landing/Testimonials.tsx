import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Infirmière indépendante, Genève",
    content: "Medannot a transformé ma pratique quotidienne. Je gagne au moins 1h par jour sur mes annotations. L'IA comprend parfaitement le langage médical suisse.",
    rating: 5,
  },
  {
    name: "Pierre Martin",
    role: "Infirmier à domicile, Lausanne",
    content: "Enfin une solution pensée pour nous ! La personnalisation de la structure est exactement ce dont j'avais besoin. Mes annotations sont maintenant impeccables.",
    rating: 5,
  },
  {
    name: "Sophie Weber",
    role: "Infirmière indépendante, Zurich",
    content: "Simple, rapide, efficace. Je dicte mes observations après chaque visite et l'annotation est prête en quelques secondes. Je recommande à tous mes collègues.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-muted-foreground">
            Découvrez ce que les infirmiers suisses disent de Medannot
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <Quote className="w-10 h-10 text-primary/30" />
                <p className="text-card-foreground italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-secondary fill-current" />
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
