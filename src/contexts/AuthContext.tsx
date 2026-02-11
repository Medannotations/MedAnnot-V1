/**
 * Auth Context - Version Infomaniak (Sans Supabase)
 * Auth maison avec JWT
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, profile as profileApi, removeToken, getToken } from "@/services/api";

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  subscription_status: "none" | "active" | "past_due" | "canceled" | "trialing" | "pending_payment" | "incomplete" | "unpaid";
  subscription_current_period_end: string | null;
  stripe_customer_id: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer le profil avec le token existant
        const profileData = await profileApi.get();
        setProfile(profileData);
        setUser({
          id: profileData.user_id,
          email: profileData.email,
          fullName: profileData.full_name || undefined,
        });
      } catch (error: any) {
        console.error("Auth init error:", error);
        // Ne supprimer le token que si c'est vraiment une erreur d'auth (401)
        if (error?.status === 401) {
          removeToken();
        } else {
          // Pour les autres erreurs (réseau, serveur), créer un user minimal depuis le token
          // pour permettre l'accès en attendant que l'API fonctionne
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.sub,
              email: payload.email,
              fullName: undefined,
            });
          } catch {
            // Si on ne peut pas décoder le token, le supprimer
            removeToken();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await profileApi.get();
      setProfile(data);
    } catch (error) {
      console.error("Profile refresh error:", error);
    }
  }, []);

  const signup = async (email: string, password: string, name?: string) => {
    const data = await auth.register(email, password, name || "");
    setUser(data.user);
    
    // Récupérer le profil après inscription
    await refreshProfile();
  };

  const login = async (email: string, password: string) => {
    const data = await auth.login(email, password);
    setUser(data.user);
    
    // Récupérer le profil après connexion
    await refreshProfile();
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  };

  const resetPassword = async (email: string) => {
    // TODO: Implémenter côté serveur
    // Pour l'instant, on redirige vers le support
    throw new Error("Contactez support@medannot.ch pour réinitialiser votre mot de passe");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      signup, 
      logout, 
      resetPassword,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
