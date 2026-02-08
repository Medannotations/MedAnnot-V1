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

// Helper to set or create a meta tag
function setMeta(attr: string, key: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

// SEO Component
function SEO() {
  useEffect(() => {
    document.title = "MedAnnot — Annotations Infirmières par IA | Dictée Vocale & Rédaction Automatique";

    // Meta description optimisée conversion + SEO
    setMeta('name', 'description', "Gagnez 2h par jour sur vos annotations infirmières. Dictez vos observations vocalement, MedAnnot génère des annotations professionnelles en secondes. Essai gratuit 7 jours, sans engagement. Conforme LPD suisse.");

    // Keywords longue traîne ciblées marché suisse
    setMeta('name', 'keywords', "annotations infirmières IA, dictée vocale médicale, logiciel infirmier Suisse, transcription médicale automatique, soins à domicile, observations infirmières, infirmier indépendant Suisse, documentation soins infirmiers, rédaction automatique soins, conforme LPD, dossier patient, aide-soignant");

    // Open Graph
    setMeta('property', 'og:title', "MedAnnot — Dictez vos observations, l'IA rédige vos annotations infirmières");
    setMeta('property', 'og:description', "Fini les heures de rédaction. Dictez, MedAnnot génère des annotations professionnelles en secondes. 7 jours gratuits, sans engagement.");
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', 'https://medannot-v1.vercel.app/');
    setMeta('property', 'og:image', 'https://medannot-v1.vercel.app/og-image.png');
    setMeta('property', 'og:locale', 'fr_CH');
    setMeta('property', 'og:site_name', 'MedAnnot');

    // Twitter Card
    setMeta('name', 'twitter:title', "MedAnnot — Annotations Infirmières par IA en 30 Secondes");
    setMeta('name', 'twitter:description', "Dictez vos observations. L'IA rédige vos annotations infirmières professionnelles. Essai gratuit 7 jours, sans engagement.");

    // Structured Data - SoftwareApplication + WebSite
    const structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MedAnnot",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "url": "https://medannot-v1.vercel.app",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CHF",
          "description": "Essai gratuit 7 jours, puis 149 CHF/mois",
          "priceValidUntil": "2026-12-31"
        },
        "description": "MedAnnot est l'assistant IA qui rédige vos annotations infirmières à partir de vos dictées vocales. Conçu pour les infirmiers indépendants en Suisse. Conforme LPD.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "127"
        },
        "publisher": {
          "@type": "Organization",
          "name": "MedAnnot",
          "url": "https://medannot-v1.vercel.app",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CH"
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MedAnnot",
        "url": "https://medannot-v1.vercel.app",
        "description": "Assistant IA pour annotations infirmières par dictée vocale",
        "inLanguage": "fr-CH"
      }
    ];

    let scriptTag = document.getElementById('structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
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

  // Rediriger automatiquement vers /app quand l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

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
    <div className="min-h-screen bg-slate-900">
      <SEO />
      <Navbar 
        onLogin={() => handleOpenAuth("login")} 
        onSignup={() => handleOpenAuth("signup")} 
      />
      
      <main>
        <HeroPremium
          onGetStarted={() => handleOpenAuth("signup")}
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
        defaultMode={authMode}
      />
    </div>
  );
}
