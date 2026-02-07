import { useEffect, useState, useCallback, useRef } from "react";

interface PersistedAnnotationState {
  selectedPatientId: string | null;
  visitDate: string;
  visitTime: string;
  visitDuration?: number;
  audioDuration: number;
  transcription: string;
  annotation: string;
  step: "patient" | "visit" | "record" | "transcription" | "result";
  timestamp: number;
}

const STORAGE_KEY = "medannot_draft_annotation";
const SESSION_KEY = "medannot_draft_handled"; // Pour éviter de redemander dans la même session
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 heures

export function usePersistedAnnotationState() {
  const [hasDraft, setHasDraft] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const hasHandledInSession = useRef(false);

  // Check for draft on mount (once)
  useEffect(() => {
    const checkDraft = () => {
      try {
        // Vérifier si on a déjà géré le brouillon dans cette session
        const sessionHandled = sessionStorage.getItem(SESSION_KEY);
        if (sessionHandled) {
          hasHandledInSession.current = true;
          setHasDraft(false);
          setIsReady(true);
          return;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          setHasDraft(false);
          setIsReady(true);
          return;
        }

        const state: PersistedAnnotationState = JSON.parse(stored);

        // Vérifier si l'état n'est pas expiré
        if (Date.now() - state.timestamp > EXPIRY_TIME) {
          localStorage.removeItem(STORAGE_KEY);
          setHasDraft(false);
          setIsReady(true);
          return;
        }

        // Vérifier qu'il y a du contenu significatif (pas juste un step vide)
        const hasMeaningfulContent = state.transcription?.trim() !== "" || 
                                      state.annotation?.trim() !== "";
        
        setHasDraft(hasMeaningfulContent);
        setIsReady(true);
      } catch (error) {
        console.error("Error checking draft:", error);
        setHasDraft(false);
        setIsReady(true);
      }
    };

    checkDraft();
  }, []);

  const saveState = useCallback((state: Partial<PersistedAnnotationState>) => {
    try {
      const currentStored = localStorage.getItem(STORAGE_KEY);
      const currentState: Partial<PersistedAnnotationState> = currentStored 
        ? JSON.parse(currentStored) 
        : {};
      
      const newState: PersistedAnnotationState = {
        ...currentState,
        ...state,
        timestamp: Date.now(),
      } as PersistedAnnotationState;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, []);

  const loadState = useCallback((): PersistedAnnotationState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const state: PersistedAnnotationState = JSON.parse(stored);

      // Vérifier si l'état n'est pas expiré
      if (Date.now() - state.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  }, []);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.setItem(SESSION_KEY, "true"); // Marquer comme géré pour cette session
      hasHandledInSession.current = true;
      setHasDraft(false);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, []);

  const markHandled = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "true");
    hasHandledInSession.current = true;
    setHasDraft(false);
  }, []);

  return {
    saveState,
    loadState,
    clearState,
    markHandled,
    hasDraft,
    isReady,
  };
}

// Hook simplifié pour juste vérifier s'il y a un brouillon (pour la page d'accueil/liste)
export function useHasDraft() {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHasDraft(false);
        return;
      }

      const state: PersistedAnnotationState = JSON.parse(stored);

      // Vérifier si expiré
      if (Date.now() - state.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(STORAGE_KEY);
        setHasDraft(false);
        return;
      }

      // Vérifier contenu significatif
      const hasMeaningfulContent = state.transcription?.trim() !== "" || 
                                    state.annotation?.trim() !== "";
      setHasDraft(hasMeaningfulContent);
    } catch (error) {
      setHasDraft(false);
    }
  }, []);

  return hasDraft;
}

// Fonction pour supprimer le brouillon (utilisable partout)
export function clearAnnotationDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Error clearing draft:", error);
  }
}

// Fonction pour récupérer le résumé du brouillon
export function getDraftSummary(): { patientId: string | null; step: string; date: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state: PersistedAnnotationState = JSON.parse(stored);

    if (Date.now() - state.timestamp > EXPIRY_TIME) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      patientId: state.selectedPatientId,
      step: state.step,
      date: new Date(state.timestamp).toLocaleDateString("fr-FR"),
    };
  } catch (error) {
    return null;
  }
}
