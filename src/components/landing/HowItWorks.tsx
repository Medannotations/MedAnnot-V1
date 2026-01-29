import { Mic, Sparkles, Copy } from "lucide-react";

const steps = [
  {
    icon: Mic,
    number: "1",
    title: "Dictez",
    description:
      "Parlez naturellement après votre visite — dans votre voiture, entre deux patients, où vous voulez. Décrivez ce que vous avez observé, comme vous le feriez à un collègue.",
    color: "blue",
  },
  {
    icon: Sparkles,
    number: "2",
    title: "L'IA rédige",
    description:
      "MedAnnot transforme votre dictée en annotation structurée et professionnelle. Vocabulaire médical précis, format clair, ton adapté.",
    color: "emerald",
  },
  {
    icon: Copy,
    number: "3",
    title: "Copiez et collez",
    description:
      "Relisez, ajustez si besoin, puis copiez l'annotation dans votre logiciel de soins habituel. Terminé.",
    color: "amber",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-emerald-600",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    gradient: "from-amber-500 to-amber-600",
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            3 étapes. 30 secondes.{" "}
            <span className="text-blue-600">C'est tout.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-gray-200 to-gray-300">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
                    {/* Number badge */}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.gradient} text-white font-bold text-xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <step.icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
