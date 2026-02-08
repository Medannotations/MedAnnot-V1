import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap, Play, Pause, X, FileText, Activity, Mic } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Link } from "react-router-dom";

interface HeroPremiumProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export function HeroPremium({ onGetStarted, onWatchDemo }: HeroPremiumProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleWatchDemo = () => {
    if (onWatchDemo) {
      onWatchDemo();
    } else {
      setIsVideoModalOpen(true);
    }
  };

  // Features list with icons
  const features = [
    { icon: FileText, text: "Annotations médicales complètes" },
    { icon: Activity, text: "Suivi des signes vitaux" },
    { icon: Mic, text: "Observations à chaud" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background médical premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-teal-900">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating orbs médicaux */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div
            className={`space-y-6 text-center lg:text-left transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Sécurité LPD Suisse garantie</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              L'annotation médicale{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                intelligente
              </span>{" "}
              pour infirmiers
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Enregistrez vos observations à chaud, laissez l'IA générer des annotations médicales complètes.
              Dédié aux infirmiers en Suisse.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {feature.text}
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Essai gratuit 7 jours
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleWatchDemo}
                className="h-14 px-8 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 text-white text-lg rounded-xl backdrop-blur-sm group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 group-hover:bg-white/20 transition-colors">
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                </div>
                Voir la démo
              </Button>
            </div>

            {/* Marketing emphasis */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <strong className="text-white/80">0 CHF</strong> aujourd'hui
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Sans engagement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Annulation en 1 clic
              </span>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/50 text-sm">
                  Utilisé par des infirmiers en Suisse
                </p>
              </div>
            </div>
          </div>

          {/* Right: App Preview */}
          <div 
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Dashboard mockup */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-emerald-500/30 rounded-3xl blur-2xl" />
              
              {/* Browser window */}
              <div className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 bg-slate-900/50 rounded-lg text-xs text-white/50 flex items-center gap-2">
                      <Logo size="xs" className="h-4" />
                      app.medannot.com
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Annotations", value: "247", color: "cyan" },
                      { label: "Patients", value: "18", color: "teal" },
                      { label: "Aujourd'hui", value: "12", color: "emerald" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className={`text-xs text-${stat.color}-400`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Annotation card mock */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">Observation enregistrée</h4>
                        <p className="text-white/50 text-xs mt-1">Patient: M. Dubois • 14:30</p>
                        <div className="mt-2 p-2 bg-slate-800/50 rounded-lg">
                          <p className="text-white/70 text-xs italic">
                            "Patient stable, tension contrôlée, médication administrée à l'heure..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-medium">+ Annotation</span>
                    </div>
                    <div className="flex-1 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <span className="text-white/60 text-sm">Patients</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Économisez 2h/jour</p>
                    <p className="text-white/50 text-xs">sur vos annotations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div 
          className={`mt-20 lg:mt-32 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Découvrez MedAnnot en action
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Voyez comment enregistrer une observation et générer une annotation complète en quelques secondes
            </p>
          </div>

          {/* Video thumbnail with play button */}
          <div 
            className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setIsVideoModalOpen(true)}
          >
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden aspect-video">
              {/* Video placeholder with pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Abstract UI mockup as video preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-2xl opacity-30">
                    <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl" />
                    <div className="h-32 bg-gradient-to-br from-teal-500/20 to-transparent rounded-xl" />
                    <div className="h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-xl" />
                    <div className="col-span-2 h-24 bg-white/5 rounded-xl" />
                    <div className="h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl" />
                  </div>
                </div>
              </div>
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium">2:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            {/* Close button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video container */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="aspect-video bg-slate-800 flex items-center justify-center">
                {/* Placeholder - Replace with actual video */}
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-cyan-400 fill-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Démo vidéo à venir
                  </h3>
                  <p className="text-white/60 max-w-md">
                    Cette vidéo présentera le flux complet : enregistrement d'une observation, 
                    génération de l'annotation, et consultation de l'historique.
                  </p>
                  <p className="text-cyan-400 text-sm mt-4">
                    Contactez-nous pour une démo live personnalisée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
