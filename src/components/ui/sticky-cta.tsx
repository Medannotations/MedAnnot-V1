import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Shield, Star } from 'lucide-react';
import { useConversionOptimization } from '@/hooks/useConversionOptimization';
import { cn } from '@/lib/utils';

/**
 * MEDICAL-GRADE STICKY CTA COMPONENT
 * Swiss Nurse Optimized - Zero Friction Design
 * Military-grade conversion optimization
 */

interface StickyCTAProps {
  variant?: 'trial' | 'demo' | 'subscribe';
  position?: 'bottom' | 'side';
  className?: string;
}

export function StickyCTA({ 
  variant = 'trial', 
  position = 'bottom',
  className 
}: StickyCTAProps) {
  const { trackConversionEvent, generateOptimizedCopy, getRiskReversal } = useConversionOptimization();
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Swiss nurse psychological triggers
  const trustSignals = [
    { icon: Shield, text: 'LPD Suisse' },
    { icon: Star, text: '127 infirmiers' },
    { icon: Clock, text: '2 min setup' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show/hide based on scroll position (smart visibility)
      if (currentScrollY > 300 && currentScrollY < document.body.scrollHeight - 1000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    trackConversionEvent('sticky_cta_click', {
      variant,
      position,
      scrollPosition: scrollY
    });

    // Navigate to appropriate page
    const routes = {
      trial: '/signup',
      demo: '/demo',
      subscribe: '/checkout'
    };

    window.location.href = routes[variant];
  };

  const ctaText = generateOptimizedCopy('cta');
  const riskReversal = getRiskReversal();

  if (position === 'bottom') {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 lg:hidden",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}>
        {/* Mobile Bottom Sticky CTA */}
        <div className="bg-background border-t shadow-lg p-4 space-y-3">
          {/* Trust Signals */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-1">
                <signal.icon className="w-3 h-3" />
                <span>{signal.text}</span>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Risk Reversal */}
          <p className="text-xs text-center text-muted-foreground">
            {riskReversal}
          </p>
        </div>
      </div>
    );
  }

  if (position === 'side') {
    return (
      <div className={cn(
        "fixed right-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 hidden lg:block",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full",
        className
      )}>
        {/* Desktop Side Sticky CTA */}
        <div className="bg-background border rounded-lg shadow-lg p-4 space-y-4 w-64">
          {/* Headline */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">
              Gagnez 2h par jour
            </h3>
            <p className="text-xs text-muted-foreground">
              {generateOptimizedCopy('headline')}
            </p>
          </div>

          {/* Trust Signals */}
          <div className="space-y-2">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <signal.icon className="w-3 h-3 text-primary" />
                <span>{signal.text}</span>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <Button 
            onClick={handleCTAClick}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Risk Reversal */}
          <p className="text-xs text-center text-muted-foreground">
            {riskReversal}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Enhanced Sticky CTA with A/B testing capabilities
 */
export function OptimizedStickyCTA({ 
  variant = 'trial',
  className 
}: StickyCTAProps) {
  const { generateOptimizedCopy, getPsychologicalTrigger, trackConversionEvent } = useConversionOptimization();
  const [currentVariant, setCurrentVariant] = useState(0);

  // Rotate through different psychological triggers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant(prev => (prev + 1) % 4);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const triggers = [
    getPsychologicalTrigger('pain'),
    getPsychologicalTrigger('solution'),
    getPsychologicalTrigger('trust'),
    getPsychologicalTrigger('urgency')
  ];

  const handleClick = () => {
    trackConversionEvent('optimized_sticky_cta_click', {
      variant: currentVariant,
      trigger: triggers[currentVariant]
    });
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 hidden sm:block",
      className
    )}>
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg shadow-xl p-4 space-y-3 max-w-sm">
        <div className="space-y-1">
          <p className="text-sm font-medium">{triggers[currentVariant]}</p>
          <p className="text-xs opacity-90">{generateOptimizedCopy('headline')}</p>
        </div>
        
        <Button 
          onClick={handleClick}
          variant="secondary"
          size="sm"
          className="w-full bg-background hover:bg-background/90 text-foreground"
        >
          {generateOptimizedCopy('cta')}
          <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default StickyCTA;