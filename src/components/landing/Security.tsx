import { Lock, ShieldCheck, User, Trash2 } from "lucide-react";

const securityPoints = [
  {
    icon: Lock,
    title: "Chiffrement de bout en bout",
    description:
      "Toutes vos données sont chiffrées pendant le transfert et le stockage. Personne n'y a accès, pas même nous.",
  },
  {
    icon: ShieldCheck,
    title: "Conformité LPD garantie",
    description:
      "MedAnnot respecte la Loi fédérale sur la Protection des Données. Vos obligations légales sont couvertes.",
  },
  {
    icon: User,
    title: "Anonymisation automatique",
    description:
      "Aucun nom de patient n'est jamais envoyé à l'IA. Seules vos observations cliniques sont traitées.",
  },
  {
    icon: Trash2,
    title: "Suppression sur demande",
    description:
      "Vos données vous appartiennent. Supprimez votre compte et tout disparaît, sans délai.",
  },
];

export function Security() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Sécurité & Conformité
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Vos données de patients ne quittent{" "}
            <span className="text-blue-400">jamais la Suisse</span>
          </h2>
        </div>

        {/* Security points grid */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {securityPoints.map((point, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 md:p-8 hover:border-blue-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-colors">
                <point.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-gray-400 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Swiss flag badge */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-full border border-white/20">
            <span className="text-2xl">🇨🇭</span>
            <span className="text-white font-medium">
              Hébergement 100% suisse
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
