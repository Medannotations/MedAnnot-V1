import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SURGICAL CEO ENHANCEMENT: Maximum reliability configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds initial delay
const REQUEST_TIMEOUT = 60000; // 60 seconds
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Enhanced error types for precise error handling
class TranscriptionError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 400) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

// CEO-GRADE retry logic with exponential backoff
async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
  factor = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`CEO RETRY: ${retries} attempts remaining, waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithExponentialBackoff(fn, retries - 1, delay * factor, factor);
    }
    throw error;
  }
}

// SURGICAL AUDIO VALIDATION - Zero tolerance for invalid files
function validateAudioFile(file: File): void {
  if (!file) {
    throw new TranscriptionError("Aucun fichier audio fourni", "NO_AUDIO_FILE");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new TranscriptionError("Le fichier audio est trop volumineux (max 25 MB)", "FILE_TOO_LARGE", 413);
  }

  const allowedTypes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
    'audio/mp4', 'audio/m4a', 'audio/webm', 'audio/ogg',
    'audio/opus', 'audio/flac'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new TranscriptionError(
      "Format audio non supporté. Utilisez MP3, WAV, M4A, WebM ou OGG.",
      "INVALID_FORMAT"
    );
  }

  if (file.size === 0) {
    throw new TranscriptionError("Le fichier audio est vide", "EMPTY_FILE");
  }
}

// CEO-GRADE audio preprocessing
async function preprocessAudio(file: File): Promise<File> {
  // Validate audio duration and quality
  return file; // For now, pass through - could add audio processing here
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Add request timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new TranscriptionError("Request timeout", "TIMEOUT", 408)), REQUEST_TIMEOUT);
  });

  try {
    const result = await Promise.race([
      handleTranscription(req),
      timeoutPromise
    ]);
    return result;
  } catch (error) {
    return handleError(error);
  }
});

async function handleTranscription(req: Request): Promise<Response> {
  // Get OpenAI API key from secrets
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    throw new TranscriptionError(
      "Service de transcription non configuré",
      "SERVICE_NOT_CONFIGURED",
      500
    );
  }

  // Parse form data
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  // SURGICAL VALIDATION - Zero tolerance
  validateAudioFile(audioFile);
  
  console.log(`CEO TRANSCRIPTION: Processing ${audioFile.name}, size: ${audioFile.size}, type: ${audioFile.type}`);

  // Preprocess audio
  const processedFile = await preprocessAudio(audioFile);

  // Prepare FormData for OpenAI Whisper API
  const whisperFormData = new FormData();
  whisperFormData.append("file", processedFile);
  whisperFormData.append("model", "whisper-1");
  whisperFormData.append("language", "fr");
  whisperFormData.append("temperature", "0.2"); // Slightly higher for better medical term recognition
  whisperFormData.append(
    "prompt",
    "Annotation infirmière pour un patient en Suisse. Termes médicaux en français suisse: hypertension, diabète, insuline, paracétamol, ibuprofène, amoxicilline, oméprazole, levothyroxine, atorvastatine, météoprolol. Noms de pathologies: Alzheimer, Parkinson, arthrose, fibromyalgie, insuffisance cardiaque, BPCO, asthme. Types de soins: pansement, injection, perfusion, surveillance, toilette, mobilisation."
  );

  // CEO-GRADE API call with maximum reliability
  const whisperResponse = await retryWithExponentialBackoff(async () => {
    console.log("CEO WHISPER: Attempting API call");
    
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CEO WHISPER ERROR:", response.status, errorText);
      
      if (response.status === 401) {
        throw new TranscriptionError(
          "Erreur d'authentification API. Contactez le support.",
          "API_AUTH_ERROR",
          500
        );
      }
      if (response.status === 429) {
        throw new TranscriptionError(
          "Quota API dépassé. Réessayez dans quelques instants.",
          "RATE_LIMIT_ERROR",
          429
        );
      }
      if (response.status >= 500) {
        throw new TranscriptionError(
          "Erreur serveur OpenAI. Réessayez.",
          "OPENAI_SERVER_ERROR",
          503
        );
      }
      
      throw new TranscriptionError(
        "Erreur lors de la transcription",
        "TRANSCRIPTION_ERROR",
        response.status
      );
    }

    return response;
  });

  const result = await whisperResponse.json();

  if (!result.text || result.text.trim().length === 0) {
    throw new TranscriptionError(
      "Aucun contenu vocal détecté. Vérifiez votre enregistrement.",
      "NO_SPEECH_DETECTED"
    );
  }

  console.log("CEO SUCCESS: Transcription completed, length:", result.text.length);

  // SURGICAL TEXT CLEANUP - Medical-grade precision
  const cleanedText = result.text
    .trim()
    .replace(/\s+/g, ' ') // Remove extra whitespace
    .replace(/[^\w\sàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ€£¥§.,;:!?()\-']/g, '') // Keep French characters
    .substring(0, 8000); // Limit to reasonable medical annotation length

  return new Response(
    JSON.stringify({ transcription: cleanedText }),
    { 
      status: 200, 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-CEO-Status": "PERFECTION_ACHIEVED"
      } 
    }
  );
}

function handleError(error: any): Response {
  console.error("CEO TRANSCRIPTION FAILURE:", error);
  
  let errorMessage = "Une erreur inattendue est survenue lors de la transcription.";
  let errorCode = "UNKNOWN_ERROR";
  let statusCode = 500;
  
  if (error instanceof TranscriptionError) {
    errorMessage = error.message;
    errorCode = error.code;
    statusCode = error.statusCode;
  } else if (error instanceof Error) {
    if (error.message.includes("network") || error.message.includes("fetch")) {
      errorMessage = "Problème de connexion réseau. Vérifiez votre connexion Internet.";
      errorCode = "NETWORK_ERROR";
    } else if (error.message.includes("timeout")) {
      errorMessage = "La transcription prend trop de temps. Réessayez avec un fichier plus court.";
      errorCode = "TIMEOUT_ERROR";
    }
  }

  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      code: errorCode,
      ceo_status: "FAILURE_ANALYZED"
    }),
    { 
      status: statusCode, 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json"
      } 
    }
  );
}