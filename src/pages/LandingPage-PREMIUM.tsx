import { useState } from "react";
import { HeroPremium } from "@/components/landing/HeroPremium";
import { Navbar } from "@/components/landing/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA-PRODUCTION";

// Lazy load sections for performance
import { lazy, Suspense } from "react";

const SocialProofBar = lazy(() => import("@/components/landing/SocialProofBar").then(m => ({ default: m.SocialProofBar })));
const Problem = lazy(() => import("@/components/landing/Problem").then(m => ({ default: m.Problem })));
const Solution = lazy(() => import("@/components/landing/Solution").then(m => ({ default: m.Solution })));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Features = lazy(() => import("@/components/landing/Features").then(m => ({ default: m.Features })));
const Security = lazy(() => import("@/components/landing/Security").then(m => ({ default: m.Security })));
const Testimonials = lazy(() => import("@/components/landing/Testimonials").then(m => ({ default: m.Testimonials })));
const Pricing = lazy(() => import("@/components/landing/PricingNew").then(m => ({ default: m.Pricing })));
const FAQ = lazy(() => import("@/components/landing/FAQ").then(m => ({ default: m.FAQ })));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA").then(m => ({ default: m.FinalCTA })));
const Footer = lazy(() => import("@/components/landing/Footer").then(m => ({ default: m.Footer })));

const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function LandingPagePremium() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenAuth = (mode: "login" | "signup") => {
    if (user) {
      navigate("/app");
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onLogin={() => handleOpenAuth("login")} 
        onSignup={() => handleOpenAuth("signup")} 
      />
      
      {/* Premium Hero */}
      <HeroPremium
        onGetStarted={() => handleOpenAuth("signup")}
        onWatchDemo={() => {
          // Scroll to demo section or open video
          const demoSection = document.getElementById('how-it-works');
          demoSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Lazy-loaded sections */}
      <Suspense fallback={<SectionLoader />}>
        <SocialProofBar />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Problem />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Solution />
      </Suspense>

      <div id="how-it-works">
        <Suspense fallback={<SectionLoader />}>
          <HowItWorks />
        </Suspense>
      </div>

      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Security />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FinalCTA onGetStarted={() => handleOpenAuth("signup")} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>

      <StickyMobileCTA onGetStarted={() => handleOpenAuth("signup")} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
