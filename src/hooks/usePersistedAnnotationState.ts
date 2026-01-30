import { useEffect, useState } from "react";

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
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 heures

export function usePersistedAnnotationState() {
  const [isRestored, setIsRestored] = useState(false);

  const saveState = (state: Partial<PersistedAnnotationState>) => {
    try {
      const currentState = loadState();
      const newState: PersistedAnnotationState = {
        ...currentState,
        ...state,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
    }
  };

  const loadState = (): PersistedAnnotationState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const state: PersistedAnnotationState = JSON.parse(stored);

      // Vérifier si l'état n'est pas expiré
      if (Date.now() - state.timestamp > EXPIRY_TIME) {
        clearState();
        return null;
      }

      return state;
    } catch (error) {
      return null;
    }
  };

  const clearState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
    }
  };

  const hasPersistedState = (): boolean => {
    const state = loadState();
    return state !== null && (state.transcription !== "" || state.annotation !== "");
  };

  useEffect(() => {
    setIsRestored(true);
  }, []);

  return {
    saveState,
    loadState,
    clearState,
    hasPersistedState,
    isRestored,
  };
}
