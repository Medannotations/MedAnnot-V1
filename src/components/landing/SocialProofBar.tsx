import { Clock, Shield, Zap, Stethoscope } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "40+",
    label: "heures",
    description: "économisées par mois en moyenne",
  },
  {
    icon: Shield,
    value: "Conforme",
    label: "LPD",
    description: "Vos données restent en Suisse",
  },
  {
    icon: Zap,
    value: "< 30",
    label: "secondes",
    description: "pour une annotation complète",
  },
  {
    icon: Stethoscope,
    value: "Vocabulaire",
    label: "médical",
    description: "suisse romand intégré",
  },
];

export function SocialProofBar() {
  return (
    <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center text-white"
            >
              <stat.icon className="w-8 h-8 mb-2 opacity-80" />
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                <span className="text-lg font-medium opacity-90">{stat.label}</span>
              </div>
              <p className="text-sm opacity-75 mt-1 hidden md:block">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
