# Déploiement Manuel des Edge Functions

## Méthode 1 : Via Supabase Dashboard (Recommandé)

### Étape 1 : Créer la fonction via l'UI

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Edge Functions** → **New Function**
3. Nom : `generate-annotation`
4. Copiez-collez le contenu ci-dessous

```typescript
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
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY non configuré" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { transcription, patientName, visitDate, userStructure } = body;

    if (!transcription?.trim()) {
      return new Response(
        JSON.stringify({ error: "Transcription requise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Appel Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{
          role: "user",
          content: `Rédige une annotation médicale professionnelle pour ${patientName}.
Date: ${visitDate}
Structure: ${userStructure}

Dictée: ${transcription}

Rédige une annotation structurée, professionnelle, en français.`
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const result = await response.json();
    const annotation = result.content?.[0]?.text?.trim() || "Erreur de génération";

    return new Response(
      JSON.stringify({ annotation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

5. Cliquez **Deploy**

### Étape 2 : Fonction de secours (optionnelle)

Créez une deuxième fonction nommée `generate-annotation-simple` :

```typescript
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
    const { transcription, patientName, visitDate } = body;
    
    const annotation = `**VISITE INFIRMIÈRE**

**Patient:** ${patientName}
**Date:** ${visitDate || new Date().toLocaleDateString("fr-CH")}

**OBSERVATIONS:**
${transcription || "Aucune observation"}

**PLAN DE SOINS:**
- Continuité des soins selon prescription
- Surveillance régulière

---
*Mode démonstration*`

    return new Response(
      JSON.stringify({ annotation, demo: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

## Méthode 2 : Avec Docker (si npm ne fonctionne pas)

```bash
# Installer Supabase via Docker
docker pull supabase/supabase-cli:latest

# Run
docker run --rm -it \
  -v $(pwd):/workspace \
  -w /workspace \
  supabase/supabase-cli:latest \
  functions deploy generate-annotation --project-ref vbaaohcsmiaxbqcyfhhl
```

## Vérification

Une fois déployé, testez avec :

```bash
curl -X POST https://vbaaohcsmiaxbqcyfhhl.supabase.co/functions/v1/generate-annotation \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transcription":"Patient stable","patientName":"Test","visitDate":"2024-01-01","userStructure":"SOAP"}'
```
