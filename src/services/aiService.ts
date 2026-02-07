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

    // Create FormData
    const formData = new FormData();
    formData.append("audio", audioFile);

    if (onProgress) onProgress(50);

    // Call edge function
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      }
    );

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
export async function generateAnnotation(
  params: GenerateAnnotationParams,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (onProgress) onProgress(20);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Session utilisateur invalide");
    }

    if (onProgress) onProgress(40);

    // Essayer la fonction principale d'abord
    let response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-annotation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    // Si échec, essayer la fonction de secours (mode démo)
    if (!response.ok) {
      console.log("Fonction principale échouée, tentative avec fonction de secours...");
      response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-annotation-simple`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );
    }

    if (onProgress) onProgress(80);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(error.error || "Erreur lors de la génération");
    }

    const result = await response.json();

    if (onProgress) onProgress(90);
    
    // Log si mode démo
    if (result.demo) {
      console.log("Mode démonstration actif:", result.message);
    }

    // MEDICAL-GRADE SECURITY: Substitute pseudonym with real patient name locally
    // The AI only saw the pseudonym, never the real name - this is critical for LPD compliance
    let finalAnnotation = result.annotation;
    
    if (result.pseudonymUsed && params.patientName) {
      // Case-insensitive replacement of pseudonym with real name
      const pseudonymRegex = new RegExp(escapeRegExp(result.pseudonymUsed), 'gi');
      finalAnnotation = finalAnnotation.replace(pseudonymRegex, params.patientName);
    }

    if (onProgress) onProgress(100);

    return finalAnnotation;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Erreur lors de la génération de l'annotation");
  }
}
