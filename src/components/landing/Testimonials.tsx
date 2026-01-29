import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie-Claire D.",
    role: "Infirmière indépendante, Lausanne",
    content:
      "Je faisais mes annotations le soir après 20h, épuisée. Maintenant, je dicte dans ma voiture entre deux patients et c'est réglé. J'ai retrouvé mes soirées.",
    result: "1h45 économisées par jour",
    avatar: "MC",
    avatarColor: "bg-blue-500",
  },
  {
    name: "Stéphane R.",
    role: "Infirmier à domicile, Genève",
    content:
      "J'étais sceptique sur l'IA pour le médical. Mais le vocabulaire est précis, les formulations sont professionnelles. Mes annotations n'ont jamais été aussi complètes.",
    result: "Qualité de documentation améliorée",
    avatar: "SR",
    avatarColor: "bg-emerald-500",
  },
  {
    name: "Nadia K.",
    role: "Infirmière indépendante, Neuchâtel",
    content:
      "Le plus dur, c'était de me souvenir des détails après 8 visites. Maintenant je dicte à chaud, tout est capturé. Plus rien ne m'échappe.",
    result: "Zéro oubli, annotations complètes",
    avatar: "NK",
    avatarColor: "bg-purple-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ce qu'en disent{" "}
            <span className="text-blue-600">les infirmiers</span>
          </h2>
          <p className="text-xl text-gray-600">
            Des professionnels comme vous qui ont retrouvé leur temps
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-blue-100 mb-4" />

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                "{testimonial.content}"
              </p>

              {/* Result badge */}
              <div className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg mb-6 inline-block self-start">
                ✓ {testimonial.result}
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-bold`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
