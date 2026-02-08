import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap, Play, Pause, RotateCcw, FileText, Activity, Mic } from "lucide-react";

interface HeroPremiumProps {
  onGetStarted?: () => void;
}

const nurseAvatars = [
  "/avatars/nurse1.jpg",
  "/avatars/nurse2.jpg",
  "/avatars/nurse3.jpg",
  "/avatars/nurse4.jpg",
];

export function HeroPremium({ onGetStarted }: HeroPremiumProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      // Video ended — reset and play again
      video.currentTime = 0;
      setHasEnded(false);
      video.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
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
                onClick={handleVideoClick}
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
                {nurseAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                  />
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

          {/* Right: Demo Video Player */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-teal-500/30 to-emerald-500/30 rounded-3xl blur-2xl" />

              {/* Video container */}
              <div
                className="relative bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden cursor-pointer group"
                onClick={handleVideoClick}
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  src="/demo.mp4"
                  onEnded={handleVideoEnded}
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video object-cover"
                />

                {/* Overlay: Play / Pause / Replay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                  }`}
                >
                  {/* Semi-transparent backdrop when not playing */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-slate-900/40" />
                  )}

                  <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                    {hasEnded ? (
                      <RotateCcw className="w-8 h-8 text-white" />
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    )}
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
      </div>
    </section>
  );
}
