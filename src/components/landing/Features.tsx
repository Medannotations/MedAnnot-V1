import { Mic, FileText, Users, History, FileOutput, Settings, Lock, Copy, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "IA spécialisée paramédical",
    description: "Notre IA est spécifiquement entraînée sur le langage médical et infirmier. Elle comprend parfaitement la terminologie médicale et rédige comme un professionnel de santé.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Rédaction professionnelle instantanée",
    description: "Annotations conformes aux standards suisses, structurées et complètes. L'IA adapte le style à votre logiciel infirmier habituel.",
  },
  {
    icon: Mic,
    title: "Dictée ultra-simple",
    description: "Parlez naturellement pendant ou après la visite. Formats acceptés : MP3, WAV, M4A. Transcription automatique avec Whisper.",
  },
  {
    icon: Copy,
    title: "Copie en 1 clic vers votre logiciel",
    description: "Une fois rédigée, copiez l'annotation directement dans votre logiciel infirmier habituel. Gain de temps maximal.",
  },
  {
    icon: Users,
    title: "Contexte patient intelligent",
    description: "L'IA tient compte des pathologies connues et de l'historique du patient pour des annotations pertinentes et précises.",
  },
  {
    icon: Settings,
    title: "Personnalisation totale",
    description: "Configurez votre structure préférée, vos abréviations, votre style. L'IA s'adapte à VOTRE façon de travailler.",
  },
  {
    icon: History,
    title: "Historique illimité",
    description: "Toutes vos annotations archivées, recherchables et accessibles à tout moment. Consultez l'historique complet de chaque patient.",
  },
  {
    icon: Lock,
    title: "Sécurité maximale",
    description: "Données chiffrées de bout en bout. Conformité stricte LPD suisse. Hébergement sécurisé. Vos données restent confidentielles.",
  },
  {
    icon: FileOutput,
    title: "Export PDF/Word",
    description: "Exportez vos annotations pour envoi au médecin traitant, facturation ou archivage professionnel.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Une IA qui comprend vraiment le langage médical
          </h2>
          <p className="text-xl text-muted-foreground">
            Spécialement entraînée pour les infirmiers suisses - rédige comme un corps médical
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group ${
                feature.highlight ? 'lg:col-span-3 border-2 border-primary/30 shadow-xl' : ''
              }`}
            >
              <CardContent className={`p-6 ${feature.highlight ? 'text-center' : ''}`}>
                <div className={`w-14 h-14 rounded-xl ${
                  feature.highlight ? 'bg-primary/20' : 'bg-primary/10'
                } flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors ${
                  feature.highlight ? 'mx-auto w-16 h-16' : ''
                }`}>
                  <feature.icon className={`${feature.highlight ? 'w-9 h-9' : 'w-7 h-7'} text-primary`} />
                </div>
                <h3 className={`${feature.highlight ? 'text-xl' : 'text-lg'} font-semibold text-card-foreground mb-2`}>
                  {feature.title}
                </h3>
                <p className={`text-muted-foreground ${feature.highlight ? 'text-base max-w-3xl mx-auto' : ''}`}>
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
