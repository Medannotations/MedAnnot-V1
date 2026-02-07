// Simple analytics hook for tracking user actions
// In production, you might want to integrate with Mixpanel, Amplitude, or Plausible

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type AnalyticsEvent =
  // Annotation events
  | "annotation_created"
  | "annotation_edited"
  | "annotation_copied"
  | "annotation_deleted"
  | "annotation_batch_copied"
  // Patient events
  | "patient_created"
  | "patient_updated"
  | "patient_archived"
  // Recording events
  | "recording_started"
  | "recording_uploaded"
  | "transcription_completed"
  | "generation_completed"
  // Configuration events
  | "structure_updated"
  | "example_added"
  | "phrase_template_used"
  // Navigation events
  | "page_view"
  // Subscription events
  | "subscription_started"
  | "subscription_cancelled";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function useAnalytics() {
  const { user } = useAuth();

  const track = useCallback((
    event: AnalyticsEvent,
    properties?: EventProperties
  ) => {
    // Add common properties
    const eventData = {
      event,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log("[Analytics]", eventData);
    }

    // In production, send to your analytics service
    // Example: mixpanel.track(event, eventData);
    // Example: plausible(event, { props: properties });

    // For now, we can store in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem("medanalytics_events") || "[]");
      events.push(eventData);
      // Keep only last 100 events
      if (events.length > 100) events.shift();
      localStorage.setItem("medanalytics_events", JSON.stringify(events));
    } catch {
      // Ignore storage errors
    }
  }, [user?.id]);

  const trackPageView = useCallback((page: string) => {
    track("page_view", { page });
  }, [track]);

  const trackAnnotationCreated = useCallback((properties: {
    patientId: string;
    duration?: number;
    hasTranscription: boolean;
  }) => {
    track("annotation_created", properties);
  }, [track]);

  const trackBatchCopy = useCallback((count: number) => {
    track("annotation_batch_copied", { count });
  }, [track]);

  const trackPhraseTemplateUsed = useCallback((templateId: string, category: string) => {
    track("phrase_template_used", { templateId, category });
  }, [track]);

  return {
    track,
    trackPageView,
    trackAnnotationCreated,
    trackBatchCopy,
    trackPhraseTemplateUsed,
  };
}

// Hook to get analytics data for debugging
export function useAnalyticsData() {
  const getEvents = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("medanalytics_events") || "[]");
    } catch {
      return [];
    }
  }, []);

  const getStats = useCallback(() => {
    const events = getEvents();
    const stats = {
      totalEvents: events.length,
      annotationsCreated: events.filter((e: any) => e.event === "annotation_created").length,
      patientsCreated: events.filter((e: any) => e.event === "patient_created").length,
      batchCopies: events.filter((e: any) => e.event === "annotation_batch_copied").length,
      templatesUsed: events.filter((e: any) => e.event === "phrase_template_used").length,
    };
    return stats;
  }, [getEvents]);

  const clearEvents = useCallback(() => {
    localStorage.removeItem("medanalytics_events");
  }, []);

  return { getEvents, getStats, clearEvents };
}
