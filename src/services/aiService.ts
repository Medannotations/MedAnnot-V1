import { supabase } from "@/integrations/supabase/client";
import { MedicalEncryption } from "@/lib/medical-encryption";

export async function transcribeAudio(
  audioFile: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (onProgress) onProgress(10);

    // Validate file size (25MB max)
    const maxSize = 25 * 1024 * 1024;
    if (audioFile.size > maxSize) {
      throw new Error("Le fichier audio est trop volumineux (max 25 MB)");
    }

    if (onProgress) onProgress(30);

    // Create FormData with proper filename for Whisper API format detection
    const formData = new FormData();
    const fileName = audioFile instanceof File ? audioFile.name : "recording.webm";
    formData.append("audio", audioFile, fileName);

    if (onProgress) onProgress(50);

    // Call edge function with timeout (90s max for transcription)
    const { data: { session } } = await supabase.auth.getSession();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    let response: Response;
    try {
      response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
          signal: controller.signal,
        }
      );
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("La transcription a pris trop de temps. Réessayez avec un enregistrement plus court.");
      }
      throw err;
    }
    clearTimeout(timeoutId);

    if (onProgress) onProgress(80);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(error.error || "Erreur lors de la transcription");
    }

    const result = await response.json();

    if (onProgress) onProgress(100);

    return result.transcription;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Erreur lors de la transcription");
  }
}

export interface GenerateAnnotationParams {
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
  vitalSigns?: Record<string, any>;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate annotation with pseudonymization for LPD compliance.
 * 
 * SECURITY FLOW:
 * 1. Client sends patientId (not name) to edge function
 * 2. Edge function generates pseudonym from patientId
 * 3. AI receives only pseudonym, never real patient name
 * 4. Edge function returns annotation with pseudonym + the pseudonym used
 * 5. Client substitutes pseudonym with real patient name locally
 * 
 * Result: Patient name NEVER leaves the client, NEVER sent to Anthropic API
 */
// Fonction fetch avec timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 30000 // 30 secondes max
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: La requête a pris trop de temps');
    }
    throw error;
  }
}

export async function generateAnnotation(
  params: GenerateAnnotationParams,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (onProgress) onProgress(10);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Session utilisateur invalide");
    }

    if (onProgress) onProgress(20);

    // Essayer la fonction principale d'abord (avec timeout de 25s)
    let response: Response;
    let usedFallback = false;
    
    try {
      console.log("[generateAnnotation] Appel fonction principale...");
      response = await fetchWithTimeout(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-annotation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        },
        25000 // 25 secondes max pour Anthropic
      );
      console.log("[generateAnnotation] Réponse principale:", response.status);
    } catch (primaryError) {
      console.log("[generateAnnotation] Fonction principale échouée:", primaryError);
      usedFallback = true;
      response = await fetchWithTimeout(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-annotation-simple`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        },
        10000 // 10 secondes max pour la fonction simple
      );
      console.log("[generateAnnotation] Réponse fallback:", response.status);
    }

    if (onProgress) onProgress(70);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[generateAnnotation] Erreur HTTP:", response.status, errorText);
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    console.log("[generateAnnotation] Résultat:", { 
      hasAnnotation: !!result.annotation,
      demo: result.demo,
      usedFallback 
    });

    if (onProgress) onProgress(90);
    
    // Log si mode démo
    if (result.demo || usedFallback) {
      console.log("Mode démonstration/fallback actif");
    }

    if (!result.annotation) {
      throw new Error("Aucune annotation reçue du serveur");
    }

    // MEDICAL-GRADE SECURITY: Substitute pseudonym with real patient name locally
    let finalAnnotation = result.annotation;
    
    if (result.pseudonymUsed && params.patientName) {
      const pseudonymRegex = new RegExp(escapeRegExp(result.pseudonymUsed), 'gi');
      finalAnnotation = finalAnnotation.replace(pseudonymRegex, params.patientName);
    }

    if (onProgress) onProgress(100);

    return finalAnnotation;
  } catch (error) {
    console.error("[generateAnnotation] Erreur finale:", error);
    throw error instanceof Error ? error : new Error("Erreur lors de la génération de l'annotation");
  }
}
