import { Button } from "@/components/ui/button";
import { Check, Shield, Sparkles, Calendar, ArrowRight, Activity, Mic, FileText, History, Zap, Users } from "lucide-react";

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
    <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-cyan-900/15 to-slate-800" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Tarification transparente
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Un seul tarif.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Tout inclus.
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            <strong className="text-white">Sans engagement, parce qu'on croit en notre produit.</strong>{" "}
            7 jours d'essai gratuit. Si MedAnnot vous fait gagner 2h par jour, vous resterez.
          </p>
        </div>

        {/* Single pricing card */}
        <div className="max-w-lg mx-auto">
          <div className="relative bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-cyan-500/20 overflow-hidden">
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white/80 uppercase tracking-wide">
                  Formule unique
                </span>
              </div>
              <div className="flex items-baseline justify-center">
                <span className="text-6xl font-bold">149</span>
                <span className="text-2xl font-medium text-white/70 ml-1">CHF</span>
                <span className="text-white/70 ml-2">/mois</span>
              </div>
              <p className="text-white/70 mt-2 text-sm">
                Sans engagement — Résiliable à tout moment
              </p>
            </div>

            <ul className="relative space-y-3 mb-8">
              {[
                "Dictée vocale illimitée",
                "Annotations IA complètes",
                "Patients illimités",
                "7 jours d'essai gratuit",
                "Support prioritaire",
                "Mises à jour automatiques",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
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
        <div className="max-w-lg mx-auto mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
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
        <div className="max-w-3xl mx-auto mt-10 bg-slate-800/30 rounded-2xl p-6 md:p-8 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">
            Tout est inclus, sans exception
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
            Carte requise, 0 CHF pendant 7 jours. Annulation en 1 clic depuis vos paramètres.
          </p>
        </div>
      </div>
    </section>
  );
}
