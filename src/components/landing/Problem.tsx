import { AlertCircle, Clock, Frown, FileText, Moon, Coffee } from "lucide-react";

export function Problem() {
  const frustrations = [
    {
      icon: <Moon className="w-5 h-5" />,
      text: "2 heures par day VOLÉES à votre vie de famille",
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              <AlertCircle className="w-4 h-4" />
              Le quotidien des infirmiers indépendants
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vous êtes devenu(e) infirmier(ère){" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                pour soigner
              </span>
              , pas pour rédiger
            </h2>
          </div>

          {/* Pain description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <Clock className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Chaque soir, la même histoire
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-red-50/70 border border-red-100 hover:bg-red-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                    {frustration.icon}
                  </div>
                  <span className="text-gray-800 font-medium">{frustration.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional hook */}
          <div className="text-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-8">
            <p className="text-xl text-gray-600 italic">
              "Ce n'est pas pour ça que vous avez choisi ce métier..."
            </p>
            <p className="mt-4 text-gray-500">
              Vous méritez de rentrer chez vous et de profiter de votre famille.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
