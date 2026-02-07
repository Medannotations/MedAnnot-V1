import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Plus, User, MoreHorizontal, LogOut, Moon, Sun, Monitor, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mainNavItems = [
  { to: "/app", icon: Home, label: "Accueil" },
  { to: "/app/patients", icon: User, label: "Patients" },
  { to: "/app/annotations/new", icon: Plus, label: "Nouvelle", isAction: true },
  { to: "/app/configuration", icon: Settings, label: "Config" },
];

const moreMenuItems = [
  { to: "/app/settings", icon: UserCircle, label: "Mon compte" },
];

const themeOptions = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Auto", icon: Monitor },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setMoreOpen(false);
    await logout();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border lg:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNavItems.map((item) => {
          const active = isActive(item.to);
          
          if (item.isAction) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-1">{item.label}</span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Sheet */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]",
                moreOpen || location.pathname === "/app/settings" || location.pathname === "/app/configuration"
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <MoreHorizontal className={cn("w-5 h-5", (moreOpen || location.pathname === "/app/settings") && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">Plus</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-3xl">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-base font-semibold truncate">
                    {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <div className="py-4 space-y-6">
              {/* Menu items */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-1 mb-2">Menu</p>
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent text-foreground"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", active && "stroke-[2.5px]")} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Theme selector */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-1">Thème</p>
                <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logout */}
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
