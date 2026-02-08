import { Mic, FileText, Zap, Smartphone, Edit3, History, Activity, Shield } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Mic,
      title: "Reconnaissance vocale médicale",
      description:
        "Comprend le vocabulaire infirmier suisse romand — abréviations, termes techniques, noms de médicaments.",
      color: "cyan",
    },
    {
      icon: Activity,
      title: "Suivi des signes vitaux",
      description:
        "Enregistrez température, tension, pouls, glycémie et plus. Historique complet par patient et par date.",
      color: "teal",
    },
    {
      icon: FileText,
      title: "Annotations complètes",
      description:
        "Générez des annotations médicales structurées avec contexte, observations, signes vitaux et plan de soins.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Génération instantanée",
      description:
        "Votre annotation est prête en moins de 10 secondes. Pas d'attente, pas de latence.",
      color: "emerald",
    },
    {
      icon: Smartphone,
      title: "Fonctionne sur mobile",
      description:
        "Dictez depuis votre smartphone, entre deux visites. L'application s'adapte à votre rythme.",
      color: "violet",
    },
    {
      icon: History,
      title: "Historique consultable",
      description:
        "Retrouvez toutes vos annotations et signes vitaux passés. Filtres avancés par patient et période.",
      color: "amber",
    },
  ];

  const colorClasses = {
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", shadow: "hover:shadow-cyan-500/10" },
    teal: { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30", shadow: "hover:shadow-teal-500/10" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", shadow: "hover:shadow-blue-500/10" },
    emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", shadow: "hover:shadow-emerald-500/10" },
    violet: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", shadow: "hover:shadow-violet-500/10" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", shadow: "hover:shadow-amber-500/10" },
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/20 to-slate-900" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tout ce qu'il vous faut,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
              rien de superflu
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            MedAnnot a été conçu avec des infirmiers pour répondre exactement à leurs besoins quotidiens.
          </p>
        </div>

        {/* Features grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = colorClasses[feature.color as keyof typeof colorClasses];
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg ${colors.shadow}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
