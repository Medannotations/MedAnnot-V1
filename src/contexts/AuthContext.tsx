import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status?: "none" | "active" | "past_due" | "canceled";
  subscription_current_period_end?: string | null;
  stripe_customer_id?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from profiles table - version simplifiée qui ne bloque jamais
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.log("Profile fetch error (non bloquant):", error.message);
        // Créer un profil virtuel en mémoire si pas trouvé
        setProfile({
          id: userId,
          user_id: userId,
          email: user?.email || "",
          full_name: user?.user_metadata?.full_name || null,
          subscription_status: "active", // Permettre l'accès par défaut
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile);
        return;
      }

      if (data) {
        console.log("Profile found:", data);
        setProfile(data as Profile);
      } else {
        console.log("No profile found - using virtual profile");
        // Créer un profil virtuel en mémoire
        setProfile({
          id: userId,
          user_id: userId,
          email: user?.email || "",
          full_name: user?.user_metadata?.full_name || null,
          subscription_status: "active", // Permettre l'accès par défaut
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile);
      }
    } catch (err) {
      console.error("Profile fetch exception (non bloquant):", err);
      // Créer un profil virtuel même en cas d'erreur
      setProfile({
        id: userId,
        user_id: userId,
        email: user?.email || "",
        full_name: user?.user_metadata?.full_name || null,
        subscription_status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile en arrière-plan (ne bloque pas)
        if (session?.user?.id) {
          fetchProfile(session.user.id); // Pas de await - ne bloque pas
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile en arrière-plan (ne bloque pas)
        if (session?.user?.id) {
          fetchProfile(session.user.id); // Pas de await
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name?: string) => {
    // Create user without email verification
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // Note: Email confirmation is handled server-side via Supabase Auth settings
    // The admin API cannot be called from client-side for security reasons

    // Sign in immediately after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, login, signup, logout, resetPassword }}>
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
