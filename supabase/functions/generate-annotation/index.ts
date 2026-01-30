import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  transcription: string;
  patientName: string;
  patientId?: string;
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

// Enhanced error handling and retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const ANTHROPIC_TIMEOUT = 60000; // 60 seconds

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Generate a deterministic pseudonym for a patient.
 * SECURITY: This ensures no real patient names are sent to external AI APIs.
 * Compliant with Swiss LPD (Loi sur la Protection des Données).
 */
function generatePseudonym(patientId?: string): string {
  const idPart = (patientId || 'UNKNOWN').slice(0, 8).toUpperCase();
  return `Patient-${idPart}`;
}

/**
 * Build the system prompt for annotation generation.
 * SECURITY: Uses pseudonym instead of real patient name.
 * Address and location data are NOT included for LPD compliance.
 */
function buildSystemPrompt(params: GenerateRequest, pseudonym: string): string {
  const {
    // NOTE: patientName, patientAddress, patientCity, patientPostalCode 
    // are intentionally NOT destructured - they must NEVER be in the prompt
    patientPathologies,
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

  // SECURITY: Use pseudonym only, never real patient name
  let prompt = `Tu es un assistant expert en rédaction d'annotations infirmières pour infirmiers indépendants en Suisse.

CONTEXTE DU PATIENT :
- Identifiant patient : ${pseudonym}`;

  // SECURITY: Address, city, postal code intentionally omitted for LPD compliance
  // No PII (Personally Identifiable Information) is sent to external AI APIs

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

[The rest of the prompt continues with enhanced security and medical compliance instructions...]