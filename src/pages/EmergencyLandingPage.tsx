// EMERGENCY LANDING PAGE OVERRIDE - Complete debug elimination
import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { EmergencyStickyCTA } from "@/components/landing/EmergencyStickyCTA"; // EMERGENCY OVERRIDE
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

// EMERGENCY: Complete bypass of all existing sticky CTA implementations
export default function EmergencyLandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
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
      {/* EMERGENCY: Ultra-clean navigation */}
      <Navbar 
        onLogin={() => handleOpenAuth("login")} 
        onSignup={() => handleOpenAuth("signup")} 
      />
      
      {/* EMERGENCY: Hero section */}
      <Hero
        onGetStarted={() => handleOpenAuth("signup")}
        onLogin={() => handleOpenAuth("login")}
      />
      <SocialProofBar />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Security />
      <Testimonials />
      <Pricing onGetStarted={() => handleOpenAuth("signup")} />
      <FAQ />
      <FinalCTA onGetStarted={() => handleOpenAuth("signup")} />
      <Footer />
      
      {/* EMERGENCY OVERRIDE: Ultra-clean sticky CTA - ZERO DEBUG CODE */}
      <EmergencyStickyCTA onGetStarted={() => handleOpenAuth("signup")} />
      
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}