import { XCircle } from "lucide-react";

const frustrations = [
  "2 heures par jour perdues en rédaction administrative",
  "Des détails importants oubliés entre deux visites",
  "Du temps volé à vos patients — et à votre vie personnelle",
  "Des annotations rédigées à la va-vite quand la fatigue prend le dessus",
  "Le stress de devoir tout documenter \"correctement\"",
];

export function Problem() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vous êtes devenu infirmier pour{" "}
              <span className="text-blue-600">soigner</span>, pas pour{" "}
              <span className="text-red-500">rédiger</span>
            </h2>
          </div>

          {/* Pain description */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-10">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Chaque soir, c'est la même histoire. Après une journée de visites, vous vous retrouvez face à votre écran, épuisé, à rédiger des annotations pendant que votre dîner refroidit. Les détails s'effacent. La fatigue s'installe. Et demain, ça recommence.
            </p>
          </div>

          {/* Frustrations list */}
          <div className="space-y-4">
            {frustrations.map((frustration, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 md:p-5 bg-red-50 border border-red-100 rounded-xl transition-all hover:bg-red-100/50"
              >
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">{frustration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
