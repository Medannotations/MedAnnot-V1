import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Navbar({ onLogin, onSignup }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-2xl font-bold text-primary">
            Medannot
          </a>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Tarification
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Témoignages
            </a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={onLogin}>
              Se connecter
            </Button>
            <Button onClick={onSignup}>
              S'inscrire
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
              Tarification
            </a>
            <a href="#testimonials" className="block text-muted-foreground hover:text-foreground transition-colors">
              Témoignages
            </a>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" onClick={onLogin}>
                Se connecter
              </Button>
              <Button onClick={onSignup}>
                S'inscrire
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
