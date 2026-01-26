import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Est-ce que je vais vraiment économiser 2 heures par jour ?",
    answer: "Oui ! La majorité de nos utilisateurs économisent entre 1,5 et 2,5 heures par jour. Pensez au temps que vous passez actuellement à rédiger vos annotations : 10-15 minutes par patient en moyenne. Avec MedAnnot, vous dictez en 2 minutes pendant ou après la visite, et l'annotation est prête en 10 secondes. Soit moins d'une minute par patient au lieu de 15 minutes.",
  },
  {
    question: "L'IA comprend-elle vraiment le jargon médical et infirmier suisse ?",
    answer: "Absolument ! Notre IA est spécifiquement entraînée sur le langage paramédical et médical suisse. Elle comprend et utilise correctement la terminologie professionnelle, les abréviations standards (TA, FC, sat O2, etc.), et respecte les formulations utilisées en Suisse romande. Elle rédige exactement comme un professionnel de santé expérimenté.",
  },
  {
    question: "Comment copier l'annotation dans mon logiciel infirmier ?",
    answer: "C'est ultra simple ! Une fois l'annotation générée, vous avez un bouton 'Copier' en un clic. Ensuite, vous collez directement dans votre logiciel habituel (Vivendi, Polypoint, ou autre). Pas besoin de changer vos habitudes - MedAnnot s'intègre parfaitement dans votre workflow existant.",
  },
  {
    question: "Que se passe-t-il après les 7 jours d'essai gratuit ?",
    answer: "RIEN si vous ne faites rien. L'essai est vraiment sans engagement : 7 jours 100% gratuits. Après cette période, vous choisissez librement si vous voulez continuer avec un abonnement (mensuel à 189 CHF ou annuel à 1499 CHF). Vous gardez le contrôle total et pouvez résilier à tout moment.",
  },
  {
    question: "Mes données médicales sont-elles vraiment sécurisées ?",
    answer: "Oui, c'est notre priorité absolue. Toutes vos données sont chiffrées de bout en bout avec les meilleurs standards de sécurité. Nous sommes strictement conformes à la Loi fédérale sur la protection des données (LPD) suisse. Hébergement en Suisse. Vos informations médicales restent 100% confidentielles et ne sont JAMAIS partagées ou utilisées à d'autres fins.",
  },
  {
    question: "Puis-je personnaliser complètement la structure des annotations ?",
    answer: "Oui, totalement ! Vous définissez votre propre structure : vos sections préférées, vos formulations habituelles, vos abréviations. L'IA s'adapte à VOTRE façon de travailler, pas l'inverse. Vous pouvez même fournir des exemples de vos anciennes annotations pour que l'IA reproduise parfaitement votre style.",
  },
  {
    question: "L'IA peut-elle faire des erreurs ? Qui est responsable ?",
    answer: "L'IA est un outil d'assistance, pas un remplacement de votre jugement professionnel. Elle génère une annotation de qualité professionnelle basée sur vos observations, mais VOUS restez toujours responsable du contenu final. Vous pouvez (et devez) relire et modifier l'annotation avant de la valider. C'est votre expertise qui prime.",
  },
  {
    question: "Est-ce que 125 CHF/mois, c'est vraiment rentable ?",
    answer: "Absolument ! Calculons ensemble : 40 heures économisées par mois. Si vous valorisez votre temps à seulement 10 CHF/heure (bien en dessous du taux horaire infirmier), ça fait 400 CHF de valeur créée. Pour 125 CHF/mois (en annuel). Sans compter la tranquillité d'esprit et la qualité de vie retrouvée. Le ROI est immédiat.",
  },
  {
    question: "Puis-je utiliser MedAnnot sur mobile ?",
    answer: "Oui, parfaitement ! L'application fonctionne sur smartphone, tablette et ordinateur. Vous pouvez dicter vos observations directement depuis votre mobile entre deux visites à domicile, et l'annotation est prête quand vous arrivez au prochain patient. C'est conçu pour les infirmiers nomades.",
  },
  {
    question: "Puis-je annuler mon abonnement facilement ?",
    answer: "Oui, en 1 clic depuis votre compte, à tout moment. Aucun frais d'annulation, aucune justification requise, aucune période minimum. C'est immédiat et sans complications. On ne retient jamais personne contre son gré.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vos questions, nos réponses
          </h2>
          <p className="text-xl text-muted-foreground">
            Tout ce que vous devez savoir sur MedAnnot pour prendre votre décision en toute sérénité
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
