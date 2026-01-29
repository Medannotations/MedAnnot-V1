import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      "Vous choisissez librement de continuer ou non. Aucune carte bancaire n'est demandée pour l'essai. Si vous ne faites rien, votre compte est simplement désactivé. Pas de mauvaise surprise.",
  },
  {
    question: "Et si l'IA fait une erreur?",
    answer:
      "Vous gardez toujours le contrôle. L'annotation générée est une proposition que vous relisez et validez avant de l'utiliser. Vous pouvez modifier le texte en un clic. L'IA vous assiste, elle ne vous remplace pas.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Questions <span className="text-blue-600">fréquentes</span>
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir avant de commencer
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left p-6 flex items-center justify-between gap-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
