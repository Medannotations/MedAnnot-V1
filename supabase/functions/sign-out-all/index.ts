// Edge Function pour déconnecter tous les utilisateurs
// À utiliser avec précaution !

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    // Créer client Supabase avec service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Récupérer tous les utilisateurs
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Déconnecter chaque utilisateur
    let count = 0;
    for (const user of users) {
      const { error } = await supabaseAdmin.auth.admin.signOut(user.id);
      if (!error) count++;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${count} utilisateurs déconnectés`,
        total: users.length
      }),
      { headers }
    );

  } catch (error) {
    console.error("Error signing out all users:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
});
