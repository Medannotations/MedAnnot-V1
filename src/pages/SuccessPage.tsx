import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, FileText, Users, Sparkles, Shield, Mic } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";

export function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bienvenue sur MedAnnot — Votre Essai Gratuit est Actif";
  }, []);

  const nextSteps = [
    {
      icon: Mic,
      title: "Enregistrez votre première annotation",
      description: "Ajoutez un patient, enregistrez une observation vocale et laissez l'IA créer une annotation complète.",
      cta: "Créer une annotation",
      action: () => navigate("/app/annotations/new"),
    },
    {
      icon: Users,
      title: "Ajoutez vos patients",
      description: "Importez vos patients existants ou créez-les un par un avec toutes leurs informations.",
      cta: "Gérer les patients",
      action: () => navigate("/app/patients"),
    },
    {
      icon: FileText,
      title: "Consultez votre historique",
      description: "Accédez à toutes vos annotations précédentes et consultez les observations passées.",
      cta: "Voir mes annotations",
      action: () => navigate("/app/annotations"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background médical */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900/70 to-teal-900/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/15 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center">
          <Logo size="lg" />
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Success Card */}
        <div className="text-center mb-10">
          {/* Badge succès */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full shadow-2xl shadow-cyan-500/30 mb-6 animate-in zoom-in-50 duration-500">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Bienvenue sur MedAnnot
          </h1>
          
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-6">
            Votre essai gratuit de <span className="text-cyan-400 font-semibold">7 jours</span> commence maintenant. 
            Profitez de toutes les fonctionnalités sans limitation.
          </p>

          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>Paiement confirmé • Abonnement actif</span>
          </div>
        </div>

        {/* Prochaines étapes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white text-center mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Commencez maintenant
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all group cursor-pointer overflow-hidden"
                  onClick={step.action}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2 text-lg">
                      {step.title}
                    </h3>
                    
                    <p className="text-white/60 text-sm leading-relaxed flex-1 mb-4">
                      {step.description}
                    </p>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 group/btn"
                    >
                      {step.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Principal */}
        <div className="mt-10 text-center">
          <Button
            size="lg"
            onClick={() => navigate("/app")}
            className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/30"
          >
            Accéder à mon espace
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Info box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Un problème ? Une question ?</h4>
              <p className="text-sm text-white/60 mt-1">
                Notre équipe de support est disponible par email à{" "}
                <a href="mailto:contact@medannot.ch" className="text-cyan-400 hover:text-cyan-300">
                  contact@medannot.ch
                </a>
                {" "}pour vous accompagner.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
