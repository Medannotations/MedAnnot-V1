import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Medannot</h3>
            <p className="text-background/70">
              L'assistant IA pour les infirmiers indépendants suisses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Tarification</a></li>
              <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Carrières</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Conditions générales</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Protection des données</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">
            © {new Date().getFullYear()} Medannot. Tous droits réservés.
          </p>
          <p className="text-background/70 text-sm flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-destructive fill-current" /> en Suisse
          </p>
        </div>
      </div>
    </footer>
  );
}
