import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroPremium } from "@/components/landing/HeroPremium";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA-PRODUCTION";
import { SocialProofBar } from "@/components/landing/SocialProofBar";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Security } from "@/components/landing/Security";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/PricingNew";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

// SEO Component
function SEO() {
  useEffect(() => {
    // Update page title and meta description
    document.title = "Medannot - Assistant IA pour Annotations Infirmières | Dictez, l'IA rédige";
    
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Medannot rédige vos annotations infirmières automatiquement à partir de vos dictées vocales. Économisez 2h/jour. Essai gratuit de 7 jours. Conforme LPD suisse.');

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'annotation infirmière, dictée médicale, IA infirmière, logiciel infirmier indépendant, Suisse, transcription vocale, rédaction médicale');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Medannot - Assistant IA pour Annotations Infirmières' },
      { property: 'og:description', content: 'Dictez vos observations. L\'IA rédige vos annotations professionnelles. Économisez 2h/jour.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://medannot-v1.vercel.app' },
      { property: 'og:image', content: 'https://medannot-v1.vercel.app/og-image.jpg' },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Structured Data - SoftwareApplication
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Medannot",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "149",
        "priceCurrency": "CHF",
        "priceValidUntil": "2025-12-31"
      },
      "description": "Assistant IA pour la rédaction d'annotations infirmières pour infirmiers indépendants en Suisse.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "127"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Medannot",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "CH"
        }
      }
    };

    let scriptTag = document.getElementById('structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup not needed as we want to keep the SEO tags
    };
  }, []);

  return null;
}

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView("landing");
  }, [trackPageView]);

  const handleOpenAuth = (mode: "login" | "signup") => {
    if (user) {
      navigate("/app");
    } else if (mode === "signup") {
      navigate("/signup");
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Navbar 
        onLogin={() => handleOpenAuth("login")} 
        onSignup={() => handleOpenAuth("signup")} 
      />
      
      <main>
        <HeroPremium
          onGetStarted={() => handleOpenAuth("signup")}
          onWatchDemo={() => {
            const demoSection = document.getElementById('how-it-works');
            demoSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        
        <SocialProofBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <Security />
        <section id="testimonials" aria-label="Témoignages">
          <Testimonials />
        </section>
        <section id="pricing" aria-label="Tarifs">
          <Pricing onGetStarted={() => handleOpenAuth("signup")} />
        </section>
        <FAQ />
        <FinalCTA onGetStarted={() => handleOpenAuth("signup")} />
      </main>
      
      <Footer />
      
      <StickyMobileCTA onGetStarted={() => handleOpenAuth("signup")} />
      
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
      />
    </div>
  );
}
