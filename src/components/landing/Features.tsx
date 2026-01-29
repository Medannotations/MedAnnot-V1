import { Mic, FileText, Zap, Smartphone, PenLine, History } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Reconnaissance vocale médicale",
    description:
      "Comprend le vocabulaire infirmier suisse romand — abréviations, termes techniques, noms de médicaments.",
  },
  {
    icon: FileText,
    title: "Templates personnalisables",
    description:
      "Adaptez le format de sortie à vos besoins: soins à domicile, suivi chronique, post-hospitalisation...",
  },
  {
    icon: Zap,
    title: "Génération instantanée",
    description:
      "Votre annotation est prête en moins de 10 secondes. Pas d'attente, pas de latence.",
  },
  {
    icon: Smartphone,
    title: "Fonctionne sur mobile",
    description:
      "Dictez depuis votre smartphone, entre deux visites. L'application s'adapte à votre rythme.",
  },
  {
    icon: PenLine,
    title: "Édition simplifiée",
    description:
      "Modifiez le texte généré en un clic. Ajoutez, supprimez, reformulez — vous gardez le contrôle.",
  },
  {
    icon: History,
    title: "Historique consultable",
    description:
      "Retrouvez vos annotations passées. Utile pour le suivi ou en cas de contrôle.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tout ce qu'il vous faut pour{" "}
            <span className="text-blue-600">gagner du temps</span>
          </h2>
          <p className="text-xl text-gray-600">
            Des fonctionnalités pensées pour le quotidien des infirmiers
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
