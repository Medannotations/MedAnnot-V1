import { Mic, FileText, Users, History, FileOutput, Settings, Lock, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "Enregistrement vocal",
    description: "Dictez ou importez vos fichiers audio. Formats acceptés : MP3, WAV, M4A. Transcription automatique avec Whisper.",
  },
  {
    icon: FileText,
    title: "Rédaction IA professionnelle",
    description: "Annotations conformes aux standards suisses. Langage médical professionnel et structuré automatiquement.",
  },
  {
    icon: Users,
    title: "Gestion patients",
    description: "Dossiers patients avec pathologies connues. L'IA tient compte du contexte médical de chaque patient.",
  },
  {
    icon: History,
    title: "Historique complet",
    description: "Toutes vos annotations archivées et facilement recherchables. Consultez l'historique de chaque patient.",
  },
  {
    icon: Settings,
    title: "Personnalisation",
    description: "Votre structure, votre style. L'IA s'adapte à VOS besoins et respecte votre façon de travailler.",
  },
  {
    icon: Lock,
    title: "Sécurité garantie",
    description: "Données chiffrées de bout en bout. Conformité LPD suisse. Vos informations restent confidentielles.",
  },
  {
    icon: Copy,
    title: "Copie en 1 clic",
    description: "Collez directement l'annotation dans votre logiciel habituel. Simple et rapide.",
  },
  {
    icon: FileOutput,
    title: "Export PDF/Word",
    description: "Exportez vos annotations pour envoi au médecin traitant, facturation ou archivage.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-muted-foreground">
            Une solution complète conçue spécifiquement pour les infirmiers indépendants suisses
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
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
