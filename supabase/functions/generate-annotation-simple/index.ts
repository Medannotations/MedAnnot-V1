// Version simplifiée pour test - retourne une annotation de démonstration
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { transcription, patientName, userStructure, visitDate } = body;
    
    // Mode DEMO : retourne une annotation formatée basée sur la transcription
    const annotation = `**VISITE INFIRMIÈRE À DOMICILE**

**Patient:** ${patientName}
**Date:** ${visitDate || new Date().toLocaleDateString("fr-CH")}

**OBSERVATIONS:**
${transcription || "Aucune observation enregistrée."}

**SOINS PRODIGUÉS:**
- Évaluation de l'état général du patient
- Surveillance des constantes
- Accompagnement et écoute

**ÉVALUATION:**
État général stable. Le patient est réactif et collaboratif.

**PLAN DE SOINS:**
- Continuité des soins selon prescription médicale
- Surveillance régulière
- Prochaine visite programmée selon protocole

---
*Annotation générée automatiquement - Mode démonstration*
*Pour la génération IA complète, configurez ANTHROPIC_API_KEY dans Supabase*`,

    return new Response(
      JSON.stringify({
        annotation,
        demo: true,
        message: "Mode démonstration actif - La génération IA complète nécessite ANTHROPIC_API_KEY"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
