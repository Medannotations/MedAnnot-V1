import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Navbar({ onLogin, onSignup }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-800/95 backdrop-blur-xl border-b border-white/15 shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo élégant */}
            <a href="/" className="flex items-center group">
              <Logo size="sm" className="group-hover:opacity-90 transition-opacity" />
            </a>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                onClick={(e) => handleNavClick(e, 'features')}
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Fonctionnalités
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => handleNavClick(e, 'pricing')}
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Tarification
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => handleNavClick(e, 'testimonials')}
                className="text-white/70 hover:text-white transition-colors font-medium"
              >
                Témoignages
              </a>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={onLogin} 
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all"
              >
                Se connecter
              </Button>
              <Button 
                onClick={onSignup}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
              >
                Essai gratuit
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-slate-800 border-b border-white/15 shadow-2xl z-50 md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className="flex items-center text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Fonctionnalités
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="flex items-center text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Tarification
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => handleNavClick(e, 'testimonials')}
              className="flex items-center text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Témoignages
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, 'faq')}
              className="flex items-center text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              FAQ
            </a>
            
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-white/10">
              <Button 
                variant="outline" 
                onClick={() => { onLogin(); closeMenu(); }}
                className="w-full min-h-[48px] text-base touch-manipulation bg-transparent border-white/20 text-white hover:text-white hover:bg-white/10 hover:border-white/30"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => { onSignup(); closeMenu(); }}
                className="w-full min-h-[48px] text-base bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold touch-manipulation shadow-lg shadow-cyan-500/20"
              >
                Essai gratuit 7 jours
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
