import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/app", icon: Home, label: "Accueil" },
  { to: "/app/patients", icon: User, label: "Patients" },
  { to: "/app/annotations/new", icon: Plus, label: "Annotations", isAction: true },
  { to: "/app/configuration", icon: Settings, label: "Config" },
];

export function MobileBottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = item.to === "/app" 
            ? location.pathname === "/app" 
            : location.pathname.startsWith(item.to);
          
          if (item.isAction) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
