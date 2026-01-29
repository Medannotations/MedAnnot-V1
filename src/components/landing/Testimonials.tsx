export function Testimonials() {
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
    },
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
  };

  return (
    <section className="py-12 md:py-20 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Témoignages
          </span>
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

        {/* Testimonials grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            {testimonials.map((testimonial, index) => {
              const colors = colorClasses[testimonial.color as keyof typeof colorClasses];
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-5 md:p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col"
                >
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
      </div>
    </section>
  );
}
