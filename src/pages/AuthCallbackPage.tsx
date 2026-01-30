import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get("code");
        const type = searchParams.get("type");

        if (!code) {
          setError("No confirmation code found");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        // Supabase automatically handles the code when the page loads
        // The session will be set in the AuthContext
        // Just wait for user to be set, then redirect

        if (user) {
          // User just confirmed email - redirect to checkout
          navigate("/checkout");
        } else {
          // Wait a bit longer for auth to process
          const timeout = setTimeout(() => {
            if (!user) {
              setError("Failed to confirm email. Please try again.");
              setTimeout(() => navigate("/"), 3000);
            }
          }, 2000);

          return () => clearTimeout(timeout);
        }
      } catch (err) {
        setError("An error occurred during confirmation");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [user, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Confirmation Error
          </h1>
          <p className="text-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Confirming your email...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your account.
        </p>
      </div>
    </div>
  );
}
