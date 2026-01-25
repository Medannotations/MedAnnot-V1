import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "L'IA comprend-elle vraiment le jargon médical suisse ?",
    answer: "Oui ! Notre IA est entraînée sur le vocabulaire médical français de Suisse romande et s'adapte à votre style de rédaction. Elle reconnaît la terminologie médicale, les abréviations standards et respecte les formulations professionnelles utilisées en Suisse.",
  },
  {
    question: "Puis-je personnaliser la structure des annotations ?",
    answer: "Absolument. Vous définissez votre propre structure d'annotation et l'IA la respecte à chaque fois. Vous pouvez également fournir des exemples d'annotations pour que l'IA apprenne votre style spécifique.",
  },
  {
    question: "Mes données sont-elles vraiment sécurisées ?",
    answer: "Oui, la sécurité est notre priorité absolue. Toutes vos données sont chiffrées de bout en bout. Nous sommes conformes à la Loi fédérale sur la protection des données (LPD) suisse. Vos informations médicales restent strictement confidentielles et ne sont jamais partagées.",
  },
  {
    question: "Que se passe-t-il après les 7 jours d'essai gratuit ?",
    answer: "Rien si vous ne faites rien. Il n'y a aucun prélèvement automatique. Vous choisissez votre formule d'abonnement (mensuel ou annuel) uniquement si vous êtes satisfait. Vous gardez le contrôle total.",
  },
  {
    question: "Puis-je annuler mon abonnement facilement ?",
    answer: "Oui, vous pouvez annuler votre abonnement en 1 clic depuis votre compte, à tout moment. Aucun frais d'annulation, aucune justification requise. C'est immédiat et sans complications.",
  },
  {
    question: "L'IA remplace-t-elle mon jugement professionnel ?",
    answer: "Non, absolument pas. L'IA est un outil pour vous faire gagner du temps en rédaction, pas pour remplacer votre expertise médicale. Vous restez toujours responsable du contenu final et pouvez modifier l'annotation générée avant de l'utiliser.",
  },
  {
    question: "Combien de temps prend la génération d'une annotation ?",
    answer: "La transcription de votre audio prend généralement 10-30 secondes selon la longueur. La génération de l'annotation structurée prend ensuite 5-10 secondes supplémentaires. Au total, moins d'une minute contre 10-15 minutes de rédaction manuelle.",
  },
  {
    question: "Puis-je utiliser Nurses Notes AI sur mobile ?",
    answer: "Oui ! L'application est entièrement responsive et fonctionne parfaitement sur smartphone et tablette. Vous pouvez dicter vos observations directement depuis votre mobile lors de vos visites à domicile.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-muted-foreground">
            Tout ce que vous devez savoir sur Nurses Notes AI
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-card border-border/50 hover:border-primary/30 transition-all overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4"
              >
                <h3 className="text-lg font-semibold text-card-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
