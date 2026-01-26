import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabaseUrl = Deno.env.get("PROJECT_URL") || "";
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400 }
      );
    }

    // Create user with email auto-confirmed
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: name || "",
      },
    });

    if (signUpError) {
      return new Response(JSON.stringify({ error: signUpError.message }), {
        status: 400,
      });
    }

    // Create profile record
    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      email: signUpData.user.email,
      full_name: name || "",
      subscription_status: "none",
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail - user is created even if profile fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: signUpData.user,
        message: "User created successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
