export function Features() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      title: "Reconnaissance vocale médicale",
      description:
        "Comprend le vocabulaire infirmier suisse romand — abréviations, termes techniques, noms de médicaments.",
      color: "blue",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Templates personnalisables",
      description:
        "Adaptez le format de sortie à vos besoins: soins à domicile, suivi chronique, post-hospitalisation...",
      color: "purple",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Génération instantanée",
      description:
        "Votre annotation est prête en moins de 10 secondes. Pas d'attente, pas de latence.",
      color: "yellow",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Fonctionne sur mobile",
      description:
        "Dictez depuis votre smartphone, entre deux visites. L'application s'adapte à votre rythme.",
      color: "emerald",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      title: "Édition simplifiée",
      description:
        "Modifiez le texte généré en un clic. Ajoutez, supprimez, reformulez — vous gardez le contrôle.",
      color: "pink",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Historique consultable",
      description:
        "Retrouvez vos annotations passées. Utile pour le suivi ou en cas de contrôle.",
      color: "indigo",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "hover:border-blue-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "hover:border-purple-200" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600", border: "hover:border-yellow-200" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "hover:border-emerald-200" },
    pink: { bg: "bg-pink-100", text: "text-pink-600", border: "hover:border-pink-200" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "hover:border-indigo-200" },
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tout ce qu'il vous faut,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              rien de superflu
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MedAnnot a été conçu avec des infirmiers suisses pour répondre exactement à leurs besoins.
          </p>
        </div>

        {/* Features grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const colors = colorClasses[feature.color as keyof typeof colorClasses];
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 ${colors.border}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-5`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
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
