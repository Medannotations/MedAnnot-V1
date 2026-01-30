import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced error handling and retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from secrets
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service de transcription non configuré" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the audio file from the request
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Aucun fichier audio fourni" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enhanced file validation
    const maxSize = 25 * 1024 * 1024; // 25MB max for Whisper
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg'];
    
    if (audioFile.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "Le fichier audio est trop volumineux (max 25 MB)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!allowedTypes.includes(audioFile.type)) {
      return new Response(
        JSON.stringify({ error: "Format audio non supporté. Utilisez MP3, WAV, M4A ou WebM." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing audio file: ${audioFile.name}, size: ${audioFile.size}, type: ${audioFile.type}`);

    // Prepare FormData for OpenAI Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append("file", audioFile);
    whisperFormData.append("model", "whisper-1");
    whisperFormData.append("language", "fr");
    whisperFormData.append("temperature", "0");
    whisperFormData.append(
      "prompt",
      "Annotation infirmière pour un patient en Suisse. Termes médicaux en français suisse. Noms de médicaments, pathologies, soins."
    );

    // Call OpenAI Whisper API with retry logic
    const whisperResponse = await retryWithBackoff(async () => {
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: whisperFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Whisper API error:", response.status, errorText);
        
        if (response.status === 401) {
          throw new Error("Erreur d'authentification API. Contactez le support.");
        }
        if (response.status === 429) {
          throw new Error("Quota API dépassé. Réessayez dans quelques instants.");
        }
        if (response.status >= 500) {
          throw new Error("Erreur serveur OpenAI. Réessayez.");
        }
        
        throw new Error("Erreur lors de la transcription");
      }

      return response;
    });

    const result = await whisperResponse.json();

    if (!result.text || result.text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucun contenu vocal détecté. Vérifiez votre enregistrement." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Transcription successful, length:", result.text.length);

    // Clean up transcription text
    const cleanedText = result.text
      .trim()
      .replace(/\s+/g, ' ') // Remove extra whitespace
      .replace(/[^\w\sàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ€£¥§.,;:!?()\-']/g, ''); // Keep French characters and basic punctuation

    return new Response(
      JSON.stringify({ transcription: cleanedText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Transcription error:", error);
    
    let errorMessage = "Une erreur inattendue est survenue lors de la transcription.";
    
    if (error instanceof Error) {
      if (error.message.includes("network")) {
        errorMessage = "Problème de connexion. Vérifiez votre réseau et réessayez.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "La transcription prend trop de temps. Réessayez avec un fichier plus court.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});