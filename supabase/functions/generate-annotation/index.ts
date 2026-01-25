import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  transcription: string;
  patientName: string;
  patientAddress?: string;
  patientPathologies: string;
  visitDate: string;
  visitTime?: string;
  visitDuration?: number;
  userStructure: string;
  userExamples: string[];
  patientExamples?: Array<{
    content: string;
    visitDate: string;
    context?: string;
  }>;
  recentAnnotations?: Array<{
    date: string;
    content: string;
  }>;
  patientCity?: string;
  patientPostalCode?: string;
}

function buildSystemPrompt(params: GenerateRequest): string {
  const {
    patientName,
    patientAddress,
    patientPathologies,
    patientCity,
    patientPostalCode,
    visitDate,
    visitTime,
    visitDuration,
    userStructure,
    userExamples,
    patientExamples,
    recentAnnotations,
  } = params;

  // Format date in French Swiss
  const formattedDate = new Date(visitDate).toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let prompt = `Tu es un assistant expert en rédaction d'annotations infirmières pour infirmiers indépendants en Suisse.

CONTEXTE DU PATIENT :
- Nom complet : ${patientName}`;

  if (patientAddress) {
    prompt += `\n- Adresse : ${patientAddress}`;
    if (patientPostalCode && patientCity) {
      prompt += `, ${patientPostalCode} ${patientCity}`;
    }
  }

  prompt += `\n${patientPathologies && patientPathologies.trim() ? `- Pathologies connues : ${patientPathologies}` : "- Pathologies connues : Aucune pathologie renseignée"}

`;

  // Ajouter les exemples spécifiques au patient si disponibles
  if (patientExamples && patientExamples.length > 0) {
    prompt += `HISTORIQUE D'ANNOTATIONS POUR CE PATIENT (pour contexte) :

Ces annotations précédentes te donnent le contexte du suivi de ce patient et le style attendu :

`;
    patientExamples.forEach((example) => {
      const exampleDate = new Date(example.visitDate).toLocaleDateString("fr-CH");
      prompt += `Annotation du ${exampleDate}`;
      if (example.context) {
        prompt += ` (${example.context})`;
      }
      prompt += ` :
${example.content}

---

`;
    });

    prompt += `En te basant sur cet historique, tu comprends :
- Le suivi habituel de ce patient
- Les pathologies et antécédents pertinents
- Le style de rédaction attendu
- Les détails importants à surveiller

`;
  }

  // Ajouter les annotations récentes si disponibles
  if (recentAnnotations && recentAnnotations.length > 0) {
    prompt += `ANNOTATIONS RÉCENTES POUR CE PATIENT (dernières visites) :

Ces annotations récentes montrent l'évolution du patient :

`;
    recentAnnotations.forEach((ann, i) => {
      const annDate = new Date(ann.date).toLocaleDateString("fr-CH");
      prompt += `Visite ${i + 1} (${annDate}) :
${ann.content}

---

`;
    });

    prompt += `Utilise ces annotations récentes pour :
- Maintenir la cohérence de style
- Suivre l'évolution du patient (amélioration, stabilité, dégradation)
- Adapter le niveau de détail selon le contexte
- Faire référence aux évolutions si pertinent dans la transcription actuelle

`;
  }

  prompt += `INFORMATIONS SUR LA VISITE ACTUELLE :
- Date : ${formattedDate}
${visitTime ? `- Heure : ${visitTime}` : ""}
${visitDuration ? `- Durée : ${visitDuration} minutes` : ""}

STRUCTURE À RESPECTER IMPÉRATIVEMENT :
${userStructure}

`;

  // Add examples if available
  if (userExamples && userExamples.length > 0) {
    prompt += `EXEMPLES DE TON STYLE D'ANNOTATION GÉNÉRAL (pour référence de ton et formatage) :

`;
    userExamples.forEach((example, index) => {
      prompt += `Exemple ${index + 1} :
${example}

---

`;
    });
  }

  prompt += `INSTRUCTIONS CRITIQUES (À SUIVRE ABSOLUMENT) :

1. **Base-toi UNIQUEMENT et INTÉGRALEMENT sur la transcription fournie**
   - Ne rajoute AUCUNE information qui n'est pas explicitement mentionnée
   - Conserve tous les détails, même mineurs, de la transcription

2. **Respecte EXACTEMENT la structure définie ci-dessus**
   - Utilise les mêmes titres de sections
   - Respecte la même hiérarchie et organisation
   - Si une section de la structure ne peut pas être remplie avec les infos disponibles, note "Non renseigné" ou "Non observé"

3. **Utilise un langage médical professionnel suisse**
   - Terminologie médicale française utilisée en Suisse romande
   - Formulations claires, précises et factuelles
   - Acronymes médicaux standards (TA, FC, T°, etc.)

4. **Intègre TOUS les détails mentionnés**
   - Signes vitaux (tension, pouls, température, etc.)
   - Observations cliniques (aspect plaie, couleur, odeur, etc.)
   - Soins prodigués (nettoyage, pansement, médication, etc.)
   - Réactions du patient (douleur, coopération, état émotionnel)
   - Échéances (prochaine visite, contrôle, etc.)

5. **Reste strictement factuel**
   - Pas d'interprétation au-delà de ce qui est dit
   - Pas de suppositions ou d'ajouts "logiques"
   - Pas de généralités non mentionnées

6. **Utilise l'historique du patient comme contexte**
   - Sois cohérent avec les annotations précédentes si disponibles
   - Mentionne les évolutions par rapport aux visites antérieures si pertinent
   - Tiens compte des pathologies et antécédents connus
   - NE recopie PAS les annotations précédentes

7. **Formate de manière claire et professionnelle**
   - Paragraphes bien structurés
   - Sauts de ligne entre les sections
   - Capitalisation appropriée
   - Ponctuation correcte

8. **Conserve les termes médicaux exacts**
   - Si l'infirmier mentionne "sérum physiologique", n'écris pas "solution saline"
   - Si l'infirmier dit "pommade antibio", tu peux développer en "pommade antibiotique"
   - Reste fidèle au vocabulaire utilisé

9. **Gère les informations manquantes avec professionnalisme**
   - Si une section ne peut pas être remplie : "Non renseigné lors de cette visite"
   - Ne laisse jamais de section vide sans explication

10. **Préserve le ton professionnel**
    - Transforme le langage parlé en langage écrit professionnel
    - "Euh", "alors", "hein", "donc" → À supprimer
    - "ça va bien" → "Évolution favorable"
    - Mais conserve le SENS exact de ce qui est dit

Rédige maintenant l'annotation complète, professionnelle et structurée en te basant UNIQUEMENT sur la transcription ci-dessous. Ne rajoute aucune information de ton propre chef.`;

  return prompt;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service de génération non configuré" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params: GenerateRequest = await req.json();

    // Validate required fields
    if (!params.transcription || params.transcription.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "La transcription est vide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!params.userStructure || params.userStructure.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucune structure d'annotation définie. Configurez votre structure dans le menu Configuration." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating annotation for patient:", params.patientName);

    const systemPrompt = buildSystemPrompt(params);

    // Call Claude API directly
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: params.transcription,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Clé API Claude invalide." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Erreur lors de la génération de l'annotation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const annotation = result.content?.[0]?.text || "";

    if (!annotation || annotation.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "L'annotation générée est vide" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Annotation generated successfully, length:", annotation.length);

    return new Response(
      JSON.stringify({ annotation: annotation.trim() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      JSON.stringify({ error: "Une erreur inattendue est survenue lors de la génération." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
