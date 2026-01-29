import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
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

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenAuth = (mode: "login" | "signup") => {
    if (user) {
      navigate("/app");
    } else if (mode === "signup") {
      // Rediriger vers la nouvelle page signup/checkout
      navigate("/signup");
    } else {
      // Ouvrir le modal uniquement pour le login
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
      
      {/* Hero + Social Proof */}
      <Hero
        onGetStarted={() => handleOpenAuth("signup")}
        onLogin={() => handleOpenAuth("login")}
      />
      <SocialProofBar />
      
      {/* Problem / Solution */}
      <Problem />
      <Solution />
      
      {/* How it works */}
      <HowItWorks />
      
      {/* Features */}
      <Features />
      
      {/* Security */}
      <Security />
      
      {/* Social proof */}
      <Testimonials />
      
      {/* Pricing */}
      <Pricing onGetStarted={() => handleOpenAuth("signup")} />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Final CTA */}
      <FinalCTA onGetStarted={() => handleOpenAuth("signup")} />
      
      {/* Footer */}
      <Footer />
      
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
