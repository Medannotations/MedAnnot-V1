import { Mic, FileText, Copy, Zap, Activity } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Ajoutez les signes vitaux",
      description:
        "Arrivé chez le patient, renseignez température, tension, pouls et autres constantes directement dans l'application. Les données sont sécurisées et prêtes à être intégrées.",
      icon: Activity,
      color: "emerald",
    },
    {
      number: "2",
      title: "Dictez",
      description:
        "À la sortie de la visite, parlez naturellement — dans votre voiture, entre deux patients, où vous voulez. Décrivez ce que vous avez observé, comme vous le feriez à un collègue.",
      icon: Mic,
      color: "cyan",
    },
    {
      number: "3",
      title: "L'IA rédige",
      description:
        "MedAnnot transforme votre dictée en annotation médicale complète. Vocabulaire médical précis, signes vitaux automatiquement intégrés, format structuré selon vos préférences.",
      icon: FileText,
      color: "teal",
    },
    {
      number: "4",
      title: "Copiez et collez",
      description:
        "Relisez, ajustez si besoin, puis copiez l'annotation dans votre logiciel de soins habituel. Terminé.",
      icon: Copy,
      color: "blue",
    },
  ];

  const colorClasses = {
    cyan: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      gradient: "from-cyan-500 to-cyan-600",
    },
    teal: {
      bg: "bg-teal-500/20",
      text: "text-teal-400",
      border: "border-teal-500/30",
      gradient: "from-teal-500 to-teal-600",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      gradient: "from-emerald-500 to-emerald-600",
    },
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      gradient: "from-blue-500 to-blue-600",
    },
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/15 to-slate-800" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            4 étapes.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              30 secondes.
            </span>{" "}
            C'est tout.
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Pas de formation, pas de logiciel compliqué. Si vous savez laisser un message vocal, vous savez utiliser MedAnnot.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300 group">
                    {/* Step number badge */}
                    <div
                      className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} text-white font-bold text-sm flex items-center justify-center shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-medium">
            <Zap className="w-5 h-5" />
            Temps moyen pour générer une annotation : moins de 10 secondes
          </div>
        </div>
      </div>
    </section>
  );
}
