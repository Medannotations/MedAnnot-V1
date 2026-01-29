import { Button } from "@/components/ui/button";
import { Menu, X, Stethoscope } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Navbar({ onLogin, onSignup }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
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
            <Button variant="ghost" onClick={onLogin} className="text-gray-700 hover:text-gray-900">
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-100">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, 'features')}
              className="block text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
            >
              Fonctionnalités
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="block text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
            >
              Tarification
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => handleNavClick(e, 'testimonials')}
              className="block text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
            >
              Témoignages
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={onLogin} className="w-full">
                Se connecter
              </Button>
              <Button 
                onClick={onSignup}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold"
              >
                Essai gratuit
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
