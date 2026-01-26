import { Mic, Users, History, Lock, Copy, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "Dictée ultra-simple",
    description: "Parlez naturellement pendant ou après la visite. MP3, WAV, M4A acceptés.",
  },
  {
    icon: Brain,
    title: "IA médicale experte",
    description: "Comprend le langage infirmier suisse et rédige comme un professionnel de santé.",
  },
  {
    icon: Users,
    title: "Contexte patient intelligent",
    description: "Tient compte des pathologies, historique et votre structure personnalisée.",
  },
  {
    icon: Copy,
    title: "Copie en 1 clic",
    description: "Copiez directement dans votre logiciel infirmier habituel (Vivendi, Polypoint...).",
  },
  {
    icon: Lock,
    title: "Sécurité suisse",
    description: "Données chiffrées, conformité LPD. Hébergement en Suisse.",
  },
  {
    icon: History,
    title: "Historique complet",
    description: "Toutes vos annotations archivées et recherchables à tout moment.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Toutes les fonctionnalités dont vous avez besoin
          </h2>
          <p className="text-xl text-muted-foreground">
            Une solution complète et simple d'utilisation
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
