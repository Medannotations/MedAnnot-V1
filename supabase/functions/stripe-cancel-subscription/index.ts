// Version debug - va logger tout ce qui arrive
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Log de TOUT ce qui arrive
  console.log("=== NEW REQUEST ===");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header:", authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No Authorization header", debug: true }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Essayer d'extraire le userId du JWT
    let userId = null;
    try {
      const token = authHeader.replace("Bearer ", "");
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      const decoded = JSON.parse(jsonPayload);
      userId = decoded.sub;
      console.log("Decoded userId:", userId);
    } catch (e) {
      console.error("JWT decode error:", e);
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Could not decode user from token", debug: true }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Pour l'instant, on retourne juste succès pour tester
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Auth works! User: " + userId,
        debug: true 
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, debug: true }),
      { status: 500, headers: corsHeaders }
    );
  }
});
