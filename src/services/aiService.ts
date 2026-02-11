/**
 * AI Service - Version sans Supabase
 * Utilise notre API backend maison
 */
import { getToken } from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function transcribeAudio(
  audioFile: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (onProgress) onProgress(10);

    const maxSize = 25 * 1024 * 1024;
    if (audioFile.size > maxSize) {
      throw new Error("Le fichier audio est trop volumineux (max 25 MB)");
    }

    if (onProgress) onProgress(30);

    const formData = new FormData();
    const mimeToExt: Record<string, string> = {
      "audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "mp4",
      "audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/wav": "wav",
      "audio/x-wav": "wav", "audio/m4a": "m4a", "audio/x-m4a": "m4a",
      "audio/flac": "flac",
    };
    const blobType = audioFile.type?.split(";")[0] || "";
    const ext = mimeToExt[blobType] || "webm";
    const fileName = audioFile instanceof File ? audioFile.name : `recording.${ext}`;
    formData.append("audio", audioFile, fileName);

    if (onProgress) onProgress(50);

    const token = getToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    let response: Response;
    try {
      response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("La transcription a pris trop de temps. Reessayez avec un enregistrement plus court.");
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
    return result.text || result.transcription;
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

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: La requete a pris trop de temps');
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

    const token = getToken();
    if (!token) {
      throw new Error("Session utilisateur invalide");
    }

    if (onProgress) onProgress(20);

    const response = await fetchWithTimeout(
      `${API_URL}/generate-annotation`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      },
      30000
    );

    if (onProgress) onProgress(70);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[generateAnnotation] Erreur HTTP:", response.status, errorText);
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();

    if (onProgress) onProgress(90);

    if (!result.annotation) {
      throw new Error("Aucune annotation recue du serveur");
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
    throw error instanceof Error ? error : new Error("Erreur lors de la generation de l'annotation");
  }
}
