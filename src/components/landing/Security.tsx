import { Lock, Flag, UserX, Trash2, Shield, Check, Server, FileCheck } from "lucide-react";

export function Security() {
  const securityPoints = [
    {
      icon: Lock,
      title: "Chiffrement de bout en bout",
      description:
        "Toutes vos données sont chiffrées pendant le transfert et le stockage. Personne n'y a accès, pas même nous.",
      color: "cyan",
    },
    {
      icon: Flag,
      title: "Conformité LPD garantie",
      description:
        "MedAnnot respecte la Loi fédérale sur la Protection des Données. Vos obligations légales sont couvertes.",
      badge: "🇨🇭 Suisse",
      color: "teal",
    },
    {
      icon: UserX,
      title: "Anonymisation automatique",
      description:
        "Aucun nom de patient n'est jamais envoyé à l'IA. Seules vos observations cliniques sont traitées.",
      color: "blue",
    },
    {
      icon: Trash2,
      title: "Suppression sur demande",
      description:
        "Vos données vous appartiennent. Supprimez votre compte et tout disparaît, sans délai.",
      color: "violet",
    },
  ];

  const colorClasses = {
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
    teal: { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    violet: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" id="security">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-emerald-950/10 to-slate-950" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Sécurité & Conformité
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Vos données de patients{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              ne quittent jamais la Suisse
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            La protection des données médicales est notre priorité absolue.
          </p>
        </div>

        {/* Security points grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {securityPoints.map((point, index) => {
              const colors = colorClasses[point.color as keyof typeof colorClasses];
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {point.title}
                        </h3>
                        {point.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">
                            {point.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { icon: Server, text: "Hébergement en Suisse" },
            { icon: Lock, text: "HTTPS / TLS 1.3" },
            { icon: FileCheck, text: "Audits réguliers" },
          ].map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70">
                <Icon className="w-4 h-4 text-teal-400" />
                {badge.text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
