import { useState } from "react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "L'IA comprend-elle vraiment le vocabulaire médical suisse?",
      answer:
        "Oui. MedAnnot a été entraînée spécifiquement sur du vocabulaire infirmier suisse romand: termes techniques, abréviations courantes, noms de médicaments utilisés en Suisse. Elle s'adapte à votre façon de parler.",
    },
    {
      question: "Mes données patients sont-elles en sécurité?",
      answer:
        "Absolument. Vos données sont chiffrées et restent en Suisse. Surtout: aucun nom de patient n'est envoyé à l'IA. Seules vos observations cliniques anonymisées sont traitées. MedAnnot est conforme à la LPD.",
    },
    {
      question: "Dois-je changer de logiciel de soins?",
      answer:
        "Non. MedAnnot génère du texte que vous copiez-collez dans votre logiciel actuel. Aucune intégration à configurer, aucun changement dans vos habitudes de documentation.",
    },
    {
      question: "Combien de temps faut-il pour apprendre à l'utiliser?",
      answer:
        "Environ 5 minutes. Vous dictez, l'IA rédige, vous copiez. Il n'y a rien de plus à apprendre. Si vous savez laisser un message vocal, vous savez utiliser MedAnnot.",
    },
    {
      question: "Que se passe-t-il après les 7 jours d'essai?",
      answer:
        "Votre carte est demandée à l'inscription mais aucun prélèvement n'est effectué pendant les 7 jours d'essai. Si vous annulez avant la fin de l'essai, vous ne payez rien. Si vous continuez, un seul tarif : 149 CHF/mois, sans engagement.",
    },
    {
      question: "Comment résilier mon abonnement?",
      answer:
        "Directement depuis vos paramètres dans l'application, en 2 clics. Pas besoin de contacter le support, pas de formulaire compliqué. Votre abonnement reste actif jusqu'à la fin de la période en cours.",
    },
    {
      question: "Et si l'IA fait une erreur?",
      answer:
        "Vous gardez toujours le contrôle. L'annotation générée est une proposition que vous relisez et validez avant de l'utiliser. Vous pouvez modifier le texte en un clic. L'IA vous assiste, elle ne vous remplace pas.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-800 overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-teal-900/15 to-slate-900" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Questions{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              fréquentes
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-500/30"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-3 min-h-[56px] touch-manipulation"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index
                        ? "bg-cyan-500 text-white rotate-180"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-white/70 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-white/60 mb-4">
            Vous avez encore des questions?
          </p>
          <a
            href="mailto:support@medannot.ch"
            className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors py-2 px-4 min-h-[44px] touch-manipulation"
          >
            <Mail className="w-5 h-5" />
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}
