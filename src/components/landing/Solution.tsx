import { Lightbulb, Check, Clock, ArrowRight, Mic, FileText, Sparkles, Activity } from "lucide-react";

export function Solution() {
  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Récupérez 2 heures par jour pour ce qui compte vraiment",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Des annotations complètes avec observations à chaud — rien n'est oublié",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      text: "Suivi des signes vitaux intégré à chaque annotation",
    },
    {
      icon: <Check className="w-5 h-5" />,
      text: "Plus de rédaction tardive, plus de fatigue accumulée",
    },
    {
      icon: <Mic className="w-5 h-5" />,
      text: "Aucun logiciel complexe à apprendre — interface intuitive",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-teal-950/20 to-slate-950" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              La solution
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Imaginez terminer vos annotations{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                avant de rentrer chez vous
              </span>
            </h2>
          </div>

          {/* Solution description */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center">
                <Mic className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Dictez, l'IA rédige, vous validez
                </h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Avec MedAnnot, vous dictez vos observations en 30 secondes dans votre voiture. 
                  L'IA génère une annotation médicale complète et structurée. Vous relisez, copiez, collez.{" "}
                  <strong className="text-cyan-400">C'est fait. Votre soirée vous appartient.</strong>
                </p>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <span className="text-white/80 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation visual */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 bg-slate-800/30 rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Avant</div>
                <div className="text-sm">2h le soir</div>
              </div>
            </div>
            
            <ArrowRight className="w-8 h-8 text-cyan-400 rotate-90 md:rotate-0" />
            
            <div className="flex items-center gap-3 text-teal-400">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="font-bold text-white">Avec MedAnnot</div>
                <div className="text-sm font-medium">30 secondes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
