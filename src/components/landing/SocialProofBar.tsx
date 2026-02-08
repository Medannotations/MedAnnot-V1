import { Clock, Shield, Zap, Mic, Activity } from "lucide-react";

export function SocialProofBar() {
  const stats = [
    {
      icon: Clock,
      value: "2h",
      label: "économisées par jour",
    },
    {
      icon: Shield,
      value: "LPD",
      label: "Données en Suisse",
    },
    {
      icon: Zap,
      value: "< 30s",
      label: "annotation complète",
    },
    {
      icon: Activity,
      value: "CH",
      label: "Signes vitaux inclus",
    },
  ];

  return (
    <section className="relative py-4 sm:py-6 bg-slate-800/80 backdrop-blur-sm border-y border-white/10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/50 via-teal-950/30 to-cyan-950/50" />

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-white justify-center md:justify-start"
              >
                <div className="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
