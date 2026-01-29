import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Récupérez 2 heures par jour pour ce qui compte vraiment",
  "Des annotations complètes, rédigées à chaud — rien n'est oublié",
  "Un vocabulaire médical professionnel, adapté aux standards suisses",
  "Plus de rédaction tardive, plus de fatigue accumulée",
  "Aucun logiciel à apprendre — vous gardez vos outils actuels",
];

export function Solution() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Imaginez terminer vos annotations{" "}
              <span className="text-emerald-600">avant de quitter votre patient</span>
            </h2>
          </div>

          {/* Solution description */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-xl p-8 md:p-10 mb-10 text-white">
            <p className="text-lg md:text-xl leading-relaxed">
              Avec MedAnnot, vous dictez vos observations en 30 secondes dans votre voiture. L'IA génère une annotation structurée et professionnelle. Vous relisez, copiez, collez.{" "}
              <span className="font-bold">C'est fait. Votre soirée vous appartient.</span>
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 md:p-5 bg-white border border-emerald-200 rounded-xl shadow-sm transition-all hover:shadow-md hover:border-emerald-300"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
