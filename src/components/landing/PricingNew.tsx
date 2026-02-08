import { Button } from "@/components/ui/button";
import { Check, Clock, Shield, Sparkles, Calendar, ArrowRight, Activity, Mic, FileText, History, Zap, Users } from "lucide-react";

interface PricingProps {
  onGetStarted: () => void;
}

export function Pricing({ onGetStarted }: PricingProps) {
  const today = new Date();
  const trialEndDate = new Date(today);
  trialEndDate.setDate(today.getDate() + 7);
  const formattedTrialEnd = trialEndDate.toLocaleDateString('fr-CH', { 
    day: 'numeric', 
    month: 'long' 
  });

  const includedFeatures = [
    { icon: Mic, text: "Dictée vocale illimitée" },
    { icon: FileText, text: "Annotations médicales complètes" },
    { icon: Activity, text: "Suivi des signes vitaux" },
    { icon: Users, text: "Patients illimités" },
    { icon: History, text: "Historique complet" },
    { icon: Zap, text: "Support prioritaire" },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/10 to-slate-900" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Tarification transparente
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Commencez gratuitement.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Puis payez si vous continuez.
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            7 jours d'essai sans engagement. Annulez avant le {formattedTrialEnd} et vous ne payez rien.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="text-sm font-medium text-white/50 uppercase tracking-wide">
                    Mensuel
                  </span>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold text-white">149</span>
                  <span className="text-2xl font-medium text-white/50 ml-1">CHF</span>
                  <span className="text-white/50 ml-2">/mois</span>
                </div>
                <p className="text-white/40 mt-2 text-sm">
                  Sans engagement, résiliable à tout moment
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Annotations illimitées",
                  "Patients illimités",
                  "7 jours d'essai gratuit",
                  "Sans engagement",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStarted}
                variant="outline"
                className="w-full py-6 h-auto text-lg font-semibold border-white/20 hover:border-cyan-500/50 hover:text-white hover:bg-cyan-500/10 transition-all bg-transparent text-white"
              >
                Commencer l'essai gratuit
              </Button>
            </div>

            {/* Annual plan - RECOMMENDED */}
            <div className="relative bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-cyan-500/20 flex flex-col overflow-hidden">
              {/* Background pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Recommended badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white text-cyan-600 text-sm font-bold shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  RECOMMANDÉ — Économisez 288 CHF/an
                </span>
              </div>

              <div className="relative mb-6 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/80 uppercase tracking-wide">
                    Annuel
                  </span>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="text-5xl font-bold">125</span>
                  <span className="text-2xl font-medium text-white/70 ml-1">CHF</span>
                  <span className="text-white/70 ml-2">/mois</span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-white/70 text-sm">
                    Engagement 12 mois — paiement mensuel
                  </p>
                </div>
              </div>

              <ul className="relative space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  <span><strong>Tout inclus</strong> du plan mensuel</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  7 jours d'essai gratuit
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  Support prioritaire
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  Économisez 16% par an
                </li>
              </ul>

              <Button
                onClick={onGetStarted}
                className="relative w-full py-6 h-auto text-lg font-bold bg-white text-cyan-600 hover:bg-cyan-50 transition-all shadow-lg"
              >
                Commencer l'essai gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Payment explanation */}
          <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">
                  0 CHF aujourd'hui. Vraiment.
                </h3>
                <p className="text-white/70">
                  Votre carte est demandée mais <strong className="text-white">aucun prélèvement n'est effectué aujourd'hui</strong>. 
                  Vous avez 7 jours pour tester. Si vous annulez avant le {formattedTrialEnd}, 
                  vous ne payez rien. Si vous continuez, le premier prélèvement aura lieu ce jour-là.
                </p>
              </div>
            </div>
          </div>

          {/* Included features */}
          <div className="mt-10 bg-slate-800/30 rounded-2xl p-6 md:p-8 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              Inclus dans les deux formules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {includedFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-white/70">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA micro-copy */}
          <div className="mt-8 text-center">
            <p className="text-white/50 flex items-center justify-center gap-2 flex-wrap">
              <Shield className="w-4 h-4" />
              Aucune carte bancaire requise pour l'essai. Annulation en 1 clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
