import { useState } from "react";

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
        "Vous choisissez librement de continuer ou non. Aucune carte bancaire n'est demandée pour l'essai. Si vous ne faites rien, votre compte est simplement désactivé. Pas de mauvaise surprise.",
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
    <section className="py-20 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Questions{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              fréquentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index
                        ? "bg-blue-600 text-white rotate-180"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Vous avez encore des questions?
          </p>
          <a
            href="mailto:support@medannot.ch"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}
