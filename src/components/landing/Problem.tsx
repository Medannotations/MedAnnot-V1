import { AlertCircle, Clock, Frown, FileText, Moon, Coffee } from "lucide-react";

export function Problem() {
  const frustrations = [
    {
      icon: <Moon className="w-5 h-5" />,
      text: "2 heures par jour VOLÉES à votre vie de famille",
    },
    {
      icon: <Frown className="w-5 h-5" />,
      text: "Vos enfants dorment quand vous finissez vos rapports à 22h",
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      text: "Votre dimanche après-midi sacrifié aux administratifs",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      text: "La peur d'avoir oublié un détail important pour votre patient",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Des annotations bâclées parce que vous êtes épuisé(e)",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950/10 to-slate-900" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mb-4">
              <AlertCircle className="w-4 h-4" />
              Le quotidien des infirmiers
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Vous êtes devenu(e) infirmier(ère){" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                pour soigner
              </span>
              , pas pour rédiger
            </h2>
          </div>

          {/* Pain description */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Chaque soir, la même histoire
                </h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Après une journée de visites épuisantes, vous vous retrouvez face à votre écran, 
                  à rédiger des annotations pendant que votre dîner refroidit. Les détails s'effacent. 
                  La fatigue s'installe. Et demain, ça recommence.
                </p>
              </div>
            </div>

            {/* Frustrations list */}
            <div className="space-y-3">
              {frustrations.map((frustration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    {frustration.icon}
                  </div>
                  <span className="text-white/80 font-medium">{frustration.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional hook */}
          <div className="text-center bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl p-8 border border-white/10">
            <p className="text-xl text-white/80 italic">
              "Ce n'est pas pour ça que vous avez choisi ce métier..."
            </p>
            <p className="mt-4 text-white/50">
              Vous méritez de rentrer chez vous et de profiter de votre famille.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
