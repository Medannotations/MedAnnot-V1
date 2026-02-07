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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if no profile

      if (error) {
        console.error("Error fetching profile:", error);
        // Don't block - continue with null profile
        return;
      }

      if (data) {
        console.log("Profile found:", data);
        setProfile(data as Profile);
      } else {
        console.log("No profile found for user");
        // Try to create a basic profile if it doesn't exist
        await createBasicProfile(userId);
      }
    } catch (err) {
      console.error("Exception fetching profile:", err);
    }
  };

  // Create a basic profile if it doesn't exist
  const createBasicProfile = async (userId: string) => {
    try {
      console.log("Attempting to create basic profile for:", userId);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          email: userData.user.email,
          full_name: userData.user.user_metadata?.full_name || null,
          subscription_status: "none",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return;
      }

      console.log("Profile created:", data);
      setProfile(data as Profile);
    } catch (err) {
      console.error("Exception creating profile:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Check for existing session FIRST
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile if session exists
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch profile when user changes
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
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

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, login, signup, logout }}>
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
