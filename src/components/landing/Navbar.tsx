import { Button } from "@/components/ui/button";
import { Menu, X, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Navbar({ onLogin, onSignup }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo élégant */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gray-900">Med</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Annot</span>
              </span>
            </a>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                onClick={(e) => handleNavClick(e, 'features')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Fonctionnalités
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => handleNavClick(e, 'pricing')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Tarification
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => handleNavClick(e, 'testimonials')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Témoignages
              </a>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onLogin} 
                className="text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 border-gray-300 font-medium transition-all"
              >
                Se connecter
              </Button>
              <Button 
                onClick={onSignup}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Essai gratuit
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Fonctionnalités
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Tarification
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => handleNavClick(e, 'testimonials')}
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              Témoignages
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, 'faq')}
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium py-3 px-4 min-h-[44px] rounded-lg touch-manipulation"
            >
              FAQ
            </a>
            
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={() => { onLogin(); closeMenu(); }}
                className="w-full min-h-[48px] text-base touch-manipulation border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => { onSignup(); closeMenu(); }}
                className="w-full min-h-[48px] text-base bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold touch-manipulation"
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
