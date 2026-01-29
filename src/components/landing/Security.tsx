export function Security() {
  const securityPoints = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Chiffrement de bout en bout",
      description:
        "Toutes vos données sont chiffrées pendant le transfert et le stockage. Personne n'y a accès, pas même nous.",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
      ),
      title: "Conformité LPD garantie",
      description:
        "MedAnnot respecte la Loi fédérale sur la Protection des Données. Vos obligations légales sont couvertes.",
      badge: "🇨🇭 Suisse",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Anonymisation automatique",
      description:
        "Aucun nom de patient n'est jamais envoyé à l'IA. Seules vos observations cliniques sont traitées.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      title: "Suppression sur demande",
      description:
        "Vos données vous appartiennent. Supprimez votre compte et tout disparaît, sans délai.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-slate-900 to-slate-800" id="security">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Sécurité & Conformité
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Vos données de patients{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              ne quittent jamais la Suisse
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            La protection des données médicales est notre priorité absolue.
          </p>
        </div>

        {/* Security points grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {securityPoints.map((point, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-4 sm:p-6 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    {point.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {point.title}
                      </h3>
                      {point.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">
                          {point.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50 text-slate-300">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Hébergement en Suisse
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50 text-slate-300">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            HTTPS / TLS 1.3
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50 text-slate-300">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Audits réguliers
          </div>
        </div>
      </div>
    </section>
  );
}
