export function Problem() {
  const frustrations = [
    "2 heures par jour perdues en rédaction administrative",
    "Des détails importants oubliés entre deux visites",
    "Du temps volé à vos patients — et à votre vie personnelle",
    "Des annotations rédigées à la va-vite quand la fatigue prend le dessus",
    "Le stress de devoir tout documenter « correctement »",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              Le problème
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vous êtes devenu infirmier{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                pour soigner
              </span>
              , pas pour rédiger
            </h2>
          </div>

          {/* Pain description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Chaque soir, c'est la même histoire. Après une journée de visites, vous vous retrouvez face à votre écran, épuisé, à rédiger des annotations pendant que votre dîner refroidit. Les détails s'effacent. La fatigue s'installe. Et demain, ça recommence.
              </p>
            </div>

            {/* Frustrations list */}
            <div className="space-y-4">
              {frustrations.map((frustration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">{frustration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional hook */}
          <div className="text-center">
            <p className="text-xl text-gray-600 italic">
              "Ce n'est pas pour ça que vous avez choisi ce métier..."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
