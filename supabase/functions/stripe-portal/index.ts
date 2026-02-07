// Edge Function pour créer un portail client Stripe
// Permet aux utilisateurs de gérer leur abonnement, changer de formule, résilier, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers }
      );
    }

    // Créer client Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Récupérer le stripe_customer_id depuis le profil
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Customer not found" }),
        { status: 404, headers }
      );
    }

    // Créer une session de portail Stripe
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${req.headers.get("origin")}/app/settings`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers }
    );

  } catch (error) {
    console.error("Error creating portal session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
});
