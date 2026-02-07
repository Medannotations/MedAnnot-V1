import { Lightbulb, Check, Clock, ArrowRight, Mic, FileText, Sparkles } from "lucide-react";

export function Solution() {
  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Récupérez 2 heures par jour pour ce qui compte vraiment",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Des annotations complètes, rédigées à chaud — rien n'est oublié",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Vocabulaire médical professionnel, adapté aux standards suisses",
    },
    {
      icon: <Check className="w-5 h-5" />,
      text: "Plus de rédaction tardive, plus de fatigue accumulée",
    },
    {
      icon: <Mic className="w-5 h-5" />,
      text: "Aucun logiciel à apprendre — vous gardez vos outils actuels",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              La solution
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Imaginez terminer vos annotations{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                avant de rentrer chez vous
              </span>
            </h2>
          </div>

          {/* Solution description */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg border border-emerald-100 p-6 sm:p-8 md:p-10 mb-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Mic className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Dictez, l'IA rédige, vous validez
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Avec MedAnnot, vous dictez vos observations en 30 secondes dans votre voiture. 
                  L'IA génère une annotation structurée et professionnelle. Vous relisez, copiez, collez.{" "}
                  <strong className="text-emerald-700">C'est fait. Votre soirée vous appartient.</strong>
                </p>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <span className="text-gray-800 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation visual */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="font-semibold">Avant</div>
                <div className="text-sm">2h le soir</div>
              </div>
            </div>
            
            <ArrowRight className="w-8 h-8 text-emerald-500 rotate-90 md:rotate-0" />
            
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="font-bold">Avec MedAnnot</div>
                <div className="text-sm font-medium">30 secondes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
