import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-nurse.jpg";

interface HeroProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function Hero({ onGetStarted, onLogin }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Pour infirmiers indépendants suisses
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Économisez <span className="text-primary">2 heures par jour</span> sur vos annotations
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              Finissez votre journée sereinement. Profitez de vos soirées au lieu de les passer à rattraper des annotations.
              <span className="block mt-2 text-foreground font-semibold">L'IA spécialisée paramédical rédige pour vous en 1 clic.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="xl"
                onClick={onGetStarted}
                className="relative transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl text-sm sm:text-base"
              >
                <span className="hidden sm:inline">🚀 Essayer gratuitement pendant 7 jours</span>
                <span className="sm:hidden">🚀 Essai gratuit 7 jours</span>
                <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg">
                  0 CHF
                </span>
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                onClick={onLogin}
                className="transform hover:scale-105 transition-all"
              >
                Se connecter
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur border border-border/50 rounded-xl p-4 inline-block">
              <p className="text-sm text-foreground font-medium">
                ✓ Sans engagement • ✓ Résiliable à tout moment • ✓ 100% gratuit pendant 7 jours
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-foreground">2h économisées chaque jour</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-foreground">Tranquillité d'esprit garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-foreground">Profitez de vos soirées</span>
              </div>
            </div>
          </div>
          
          {/* Right content - Hero image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Infirmière utilisant Medannot" 
              className="relative w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
