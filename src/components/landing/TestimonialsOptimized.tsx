import { Button } from "@/components/ui/button";

export function TestimonialsOptimized() {
  const testimonials = [
    {
      name: "Marie-Claire D.",
      role: "Infirmière indépendante, Lausanne",
      quote:
        "Je faisais mes annotations le soir après 20h, épuisée. Maintenant, je dicte dans ma voiture entre deux patients et c'est réglé. J'ai retrouvé mes soirées.",
      result: "1h45 économisées par jour",
      resultIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      avatar: "MC",
      color: "blue",
      rating: 5,
      verified: true,
    },
    {
      name: "Stéphane R.",
      role: "Infirmier à domicile, Genève",
      quote:
        "J'étais sceptique sur l'IA pour le médical. Mais le vocabulaire est précis, les formulations sont professionnelles. Mes annotations n'ont jamais été aussi complètes.",
      result: "Qualité de documentation améliorée",
      resultIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      avatar: "SR",
      color: "emerald",
      rating: 5,
      verified: true,
    },
    {
      name: "Nadia K.",
      role: "Infirmière indépendante, Neuchâtel",
      quote:
        "Le plus dur, c'était de me souvenir des détails après 8 visites. Maintenant je dicte à chaud, tout est capturé. Plus rien ne m'échappe.",
      result: "Zéro oubli, annotations complètes",
      resultIcon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      avatar: "NK",
      color: "purple",
      rating: 5,
      verified: true,
    },
  ];

  // NEW: Stats section
  const stats = [
    { label: "Infirmiers actifs", value: "127+", color: "blue" },
    { label: "Heures économisées", value: "2,540+", color: "emerald" },
    { label: "Note moyenne", value: "4.8/5", color: "yellow" },
    { label: "Conformité LPD", value: "100%", color: "green" },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      resultBg: "bg-blue-50",
      resultText: "text-blue-700",
      border: "border-blue-200",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      resultBg: "bg-emerald-50",
      resultText: "text-emerald-700",
      border: "border-emerald-200",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      resultBg: "bg-purple-50",
      resultText: "text-purple-700",
      border: "border-purple-200",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      resultBg: "bg-yellow-50",
      resultText: "text-yellow-700",
      border: "border-yellow-200",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-700",
      resultBg: "bg-green-50",
      resultText: "text-green-700",
      border: "border-green-200",
    },
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Enhanced section header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <span className="text-yellow-500">⭐</span>
            <span>4.8/5 note moyenne</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ils ont{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              retrouvé leur temps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des infirmiers suisses partagent leur expérience avec MedAnnot.
          </p>
        </div>

        {/* NEW: Stats grid */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const colors = colorClasses[stat.color as keyof typeof colorClasses];
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} ${colors.text} mb-2`}>
                    <span className="text-lg font-bold">{stat.value.includes('+') ? stat.value : stat.value.split('/')[0]}</span>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced testimonials grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            {testimonials.map((testimonial, index) => {
              const colors = colorClasses[testimonial.color as keyof typeof colorClasses];
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-5 md:p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col relative"
                >
                  {/* NEW: Verified badge */}
                  {testimonial.verified && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Vérifié
                    </div>
                  )}

                  {/* Quote icon */}
                  <div className="mb-3 md:mb-4">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 flex-grow italic">
                    "{testimonial.quote}"
                  </p>

                  {/* NEW: Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Result badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full ${colors.resultBg} ${colors.resultText} text-xs md:text-sm font-medium mb-4 md:mb-6 w-fit`}
                  >
                    {testimonial.resultIcon}
                    {testimonial.result}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 truncate">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEW: CTA section */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Rejoignez les 127+ infirmiers qui ont déjà transformé leur quotidien
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Essayer MedAnnot maintenant
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            7 jours gratuits • Sans engagement • Annulation en 1 clic
          </p>
        </div>
      </div>
    </section>
  );
}