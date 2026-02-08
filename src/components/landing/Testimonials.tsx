import { Clock, Award, CheckCircle, Quote, MessageSquare } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Marie-Claire D.",
      role: "Infirmière, Lausanne",
      quote:
        "Je faisais mes annotations le soir après 20h, épuisée. Mes enfants ne me voyaient plus. Maintenant, je dicte dans ma voiture entre deux patients et je suis à la maison à 19h. Ils ont retrouvé leur maman.",
      result: "1h45 économisées par jour",
      resultIcon: Clock,
      avatar: "MC",
      color: "cyan",
    },
    {
      name: "Stéphane R.",
      role: "Infirmier à domicile, Genève",
      quote:
        "J'étais sceptique sur l'IA pour le médical. Mais le vocabulaire est précis, les formulations sont professionnelles. Mes collègues me demandent comment je fais pour avoir des rapports aussi complets.",
      result: "Documentation de qualité",
      resultIcon: Award,
      avatar: "SR",
      color: "teal",
    },
    {
      name: "Nadia K.",
      role: "Infirmière, Neuchâtel",
      quote:
        "Le plus dur, c'était de me souvenir des détails après 8 visites. Maintenant je dicte à chaud, tout est capturé. Plus rien ne m'échappe.",
      result: "Zéro oubli, annotations complètes",
      resultIcon: CheckCircle,
      avatar: "NK",
      color: "emerald",
    },
  ];

  const colorClasses = {
    cyan: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      resultBg: "bg-cyan-500/10",
      resultText: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    teal: {
      bg: "bg-teal-500/20",
      text: "text-teal-400",
      resultBg: "bg-teal-500/10",
      resultText: "text-teal-400",
      border: "border-teal-500/30",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      resultBg: "bg-emerald-500/10",
      resultText: "text-emerald-400",
      border: "border-emerald-500/30",
    },
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/15 to-slate-800" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ils ont{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              retrouvé leur temps
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Des infirmiers suisses partagent leur expérience avec MedAnnot.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => {
              const colors = colorClasses[testimonial.color as keyof typeof colorClasses];
              const ResultIcon = testimonial.resultIcon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300 flex flex-col group"
                >
                  {/* Quote icon */}
                  <div className="mb-4">
                    <div className={`w-10 h-10 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}>
                      <Quote className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-white/80 text-base leading-relaxed mb-4 flex-grow italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Result badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${colors.resultBg} ${colors.resultText} text-sm font-medium mb-4 w-fit`}
                  >
                    <ResultIcon className="w-4 h-4" />
                    {testimonial.result}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div
                      className={`w-12 h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-lg flex-shrink-0`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-white/50 truncate">
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
