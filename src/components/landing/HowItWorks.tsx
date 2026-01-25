import { Mic, Brain, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Mic,
    number: "1",
    title: "DICTEZ",
    description: "Enregistrez votre visite",
    detail: "Dictez vos observations pendant ou juste après la visite. 2 minutes suffisent.",
  },
  {
    icon: Brain,
    number: "2",
    title: "L'IA RÉDIGE",
    description: "Annotation structurée",
    detail: "L'IA génère une annotation professionnelle conforme à vos standards. En 10 secondes.",
  },
  {
    icon: Copy,
    number: "3",
    title: "COPIEZ",
    description: "Dans votre logiciel",
    detail: "Copiez en un clic dans votre logiciel habituel. C'est terminé.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple comme 1-2-3
          </h2>
          <p className="text-xl text-muted-foreground">
            Trois étapes pour transformer votre dictée en annotation professionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-primary/50" />
                </div>
              )}

              <Card className="relative z-10 bg-card border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-6 mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 transition-transform">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {step.description}
                  </p>
                  <p className="text-muted-foreground">
                    {step.detail}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            <strong className="text-foreground">Résultat :</strong> 2 heures économisées chaque jour = 40h par mois !
          </p>
        </div>
      </div>
    </section>
  );
}
