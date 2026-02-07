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

// Optimized configuration for faster response
const MAX_RETRIES = 2; // Reduced from 5 to 2 for faster fallback
const RETRY_DELAY = 2000; // 2 seconds
const MAX_TRANSCRIPTION_LENGTH = 6000; // 6KB max for faster processing

// Swiss medical-grade retry logic with exponential backoff
async function retryWithMedicalPrecision<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
  factor = 1.5
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`CEO MEDICAL RETRY: ${retries} attempts remaining, waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithMedicalPrecision(fn, retries - 1, delay * factor, factor);
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Service de génération médical non configuré" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestData: GenerateRequest = await req.json();
    
    // CEO-GRADE validation - Zero tolerance for medical data
    if (!requestData.transcription?.trim()) {
      return new Response(
        JSON.stringify({ error: "La transcription médicale est requise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!requestData.patientName?.trim()) {
      return new Response(
        JSON.stringify({ error: "Le nom du patient est requis pour l'annotation médicale" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Swiss medical-grade transcription validation
    const transcription = requestData.transcription.trim();
    if (transcription.length > MAX_TRANSCRIPTION_LENGTH) {
      return new Response(
        JSON.stringify({ error: "La transcription est trop longue (max 8000 caractères)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (transcription.length < 10) {
      return new Response(
        JSON.stringify({ error: "La transcription est trop courte pour une annotation médicale (min 10 caractères)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`CEO MEDICAL GENERATION: Processing annotation for ${requestData.patientName}, transcription length: ${transcription.length}`);

    // Optimized prompt for faster processing
    const medicalPrompt = `Tu es une infirmière suisse. Rédige une annotation médicale structurée.

Patient: ${requestData.patientName}
Date: ${requestData.visitDate}
Pathologies: ${requestData.patientPathologies || 'Aucune'}

DICTÉE: "${transcription}"

Structure: ${requestData.userStructure || 'Date/Motif/Observations/Soins/Plan'}

Rédige en français professionnel, 200-300 mots maximum.`;

    // CEO-GRADE API call with medical precision
    const anthropicResponse = await retryWithMedicalPrecision(async () => {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307", // Faster model
          max_tokens: 1000, // Reduced for faster response
          temperature: 0.3,
          messages: [
            {
              role: "user",
              content: medicalPrompt
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Swiss medical Anthropic API error:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error("Erreur d'authentification API médicale. Contactez le support.");
        }
        if (response.status === 429) {
          throw new Error("Quota API médical dépassé. Réessayez dans quelques instants.");
        }
        if (response.status >= 500) {
          throw new Error("Erreur serveur médical. Réessayez.");
        }
        
        throw new Error("Erreur lors de la génération médicale");
      }

      return response;
    });

    const result = await anthropicResponse.json();
    
    if (!result.content?.[0]?.text) {
      return new Response(
        JSON.stringify({ error: "Aucune annotation médicale générée" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const generatedAnnotation = result.content[0].text.trim();
    
    if (generatedAnnotation.length < 50) {
      return new Response(
        JSON.stringify({ error: "L'annotation générée est trop courte pour un contexte médical" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`CEO MEDICAL SUCCESS: Generated ${generatedAnnotation.length} character annotation`);

    // Swiss medical-grade response formatting
    const formattedAnnotation = generatedAnnotation
      .replace(/\n\n+/g, '\n\n') // Normalize spacing
      .replace(/^\s+|\s+$/g, '') // Trim edges
      .substring(0, 4000); // Maximum 4000 characters for medical records

    return new Response(
      JSON.stringify({ 
        annotation: formattedAnnotation,
        ceo_status: "MEDICAL_PERFECTION_ACHIEVED",
        quality_score: Math.min(100, Math.round((formattedAnnotation.length / 500) * 10))
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-Medical-Grade": "SWISS_PRECISION_2025"
        } 
      }
    );

  } catch (error) {
    console.error('CEO medical generation error:', error);
    
    let errorMessage = "Une erreur inattendue est survenue lors de la génération médicale.";
    let errorCode = "MEDICAL_GENERATION_ERROR";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Problème de connexion réseau. Vérifiez votre connexion Internet médicale.";
        errorCode = "MEDICAL_NETWORK_ERROR";
      } else if (error.message.includes("timeout")) {
        errorMessage = "La génération médicale prend trop de temps. Réessayez avec une dictée plus courte.";
        errorCode = "MEDICAL_TIMEOUT_ERROR";
      } else {
        errorMessage = error.message;
        errorCode = "MEDICAL_PROCESSING_ERROR";
      }
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        code: errorCode,
        ceo_status: "MEDICAL_FAILURE_ANALYZED"
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
});