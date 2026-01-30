import { useEffect, useState } from 'react';

interface VoiceProcessingMetrics {
  transcriptionSuccess: boolean;
  transcriptionTime: number;
  annotationSuccess: boolean;
  annotationTime: number;
  audioQuality: number;
  errorCount: number;
  lastProcessedAt?: string;
}

interface MedicalQualityMetrics {
  encryptionSuccess: boolean;
  patientDataExposure: boolean;
  transcriptionAccuracy: number;
  annotationQuality: number;
  swissMedicalCompliance: boolean;
}

// CEO-GRADE perfection monitoring for voice annotation pipeline
export function useVoicePerfectionMonitoring() {
  const [metrics, setMetrics] = useState<VoiceProcessingMetrics>({
    transcriptionSuccess: true,
    transcriptionTime: 0,
    annotationSuccess: true,
    annotationTime: 0,
    audioQuality: 100,
    errorCount: 0,
  });

  const [medicalQuality, setMedicalQuality] = useState<MedicalQualityMetrics>({
    encryptionSuccess: true,
    patientDataExposure: false,
    transcriptionAccuracy: 95,
    annotationQuality: 98,
    swissMedicalCompliance: true,
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  // Swiss medical-grade quality validation
  const validateMedicalQuality = (newMetrics: Partial<VoiceProcessingMetrics>) => {
    const alerts: string[] = [];

    if (newMetrics.transcriptionTime && newMetrics.transcriptionTime > 30000) {
      alerts.push("⚠️ Transcription time exceeds 30 seconds - Swiss precision compromised");
    }

    if (newMetrics.annotationTime && newMetrics.annotationTime > 45000) {
      alerts.push("⚠️ Annotation generation exceeds 45 seconds - Medical efficiency impacted");
    }

    if (newMetrics.audioQuality && newMetrics.audioQuality < 80) {
      alerts.push("⚠️ Audio quality below 80% - Medical transcription accuracy at risk");
    }

    if (newMetrics.errorCount && newMetrics.errorCount > 0) {
      alerts.push(`🚨 ${newMetrics.errorCount} errors detected - Immediate surgical correction required`);
    }

    setAlerts(alerts);
    return alerts.length === 0;
  };

  // CEO-grade performance logging
  const logVoiceProcessing = (stage: 'transcription' | 'annotation', success: boolean, duration: number, metadata?: any) => {
    const timestamp = new Date().toISOString();
    
    setMetrics(prev => {
      const updated = {
        ...prev,
        lastProcessedAt: timestamp,
        [`${stage}Success`]: success,
        [`${stage}Time`]: duration,
        errorCount: success ? prev.errorCount : prev.errorCount + 1,
      } as VoiceProcessingMetrics;

      // Validate Swiss medical standards
      validateMedicalQuality(updated);
      
      return updated;
    });

    // Send to analytics (never fails main operation)
    if (typeof window !== 'undefined') {
      const eventData = {
        event: `voice_${stage}`,
        success,
        duration,
        timestamp,
        quality_score: success ? 100 - Math.min(duration / 1000, 30) : 0,
        ...metadata,
      };

      // Send to multiple analytics for redundancy
      if (window.gtag) {
        window.gtag('event', `voice_${stage}`, eventData);
      }

      // Custom analytics endpoint
      fetch('/api/analytics/voice-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        keepalive: true
      }).catch(() => {}); // Silent fail for analytics
    }
  };

  // Swiss medical-grade encryption verification
  const verifyMedicalEncryption = async (patientData: any): Promise<boolean> => {
    try {
      // Verify zero patient data exposure
      const hasEncryption = !!patientData.encrypted;
      const hasPseudonym = !!patientData.pseudonym;
      const noRawNames = !patientData.rawPatientName;
      
      setMedicalQuality(prev => ({
        ...prev,
        encryptionSuccess: hasEncryption,
        patientDataExposure: !noRawNames,
        swissMedicalCompliance: hasEncryption && hasPseudonym && noRawNames,
      }));

      return hasEncryption && hasPseudonym && noRawNames;
    } catch (error) {
      setMedicalQuality(prev => ({
        ...prev,
        encryptionSuccess: false,
        swissMedicalCompliance: false,
      }));
      return false;
    }
  };

  // Real-time monitoring with Swiss precision
  useEffect(() => {
    const monitoringInterval = setInterval(() => {
      // Check for degradation in performance
      if (metrics.errorCount > 3) {
        setAlerts(prev => [...prev, "🚨 CRITICAL: Multiple voice processing failures - CEO intervention required"]);
      }

      if (metrics.transcriptionTime > 60000 || metrics.annotationTime > 90000) {
        setAlerts(prev => [...prev, "🚨 CRITICAL: Processing times exceed medical-grade thresholds"]);
      }

      if (medicalQuality.patientDataExposure) {
        setAlerts(prev => [...prev, "🔒 SECURITY BREACH: Patient data exposure detected - Immediate containment required"]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(monitoringInterval);
  }, [metrics, medicalQuality]);

  // CEO-grade alert system
  const getAlertSeverity = () => {
    if (alerts.some(alert => alert.includes("🚨"))) return "CRITICAL";
    if (alerts.some(alert => alert.includes("⚠️"))) return "WARNING";
    if (alerts.some(alert => alert.includes("🔒"))) return "SECURITY";
    return "NORMAL";
  };

  const getPerformanceScore = () => {
    const transcriptionScore = metrics.transcriptionSuccess ? Math.max(0, 100 - (metrics.transcriptionTime / 1000)) : 0;
    const annotationScore = metrics.annotationSuccess ? Math.max(0, 100 - (metrics.annotationTime / 1000)) : 0;
    const qualityScore = metrics.audioQuality;
    const encryptionScore = medicalQuality.encryptionSuccess ? 100 : 0;
    
    return Math.round((transcriptionScore + annotationScore + qualityScore + encryptionScore) / 4);
  };

  return {
    metrics,
    medicalQuality,
    alerts,
    alertSeverity: getAlertSeverity(),
    performanceScore: getPerformanceScore(),
    logVoiceProcessing,
    verifyMedicalEncryption,
    isMedicalGrade: () => {
      return metrics.transcriptionSuccess && 
             metrics.annotationSuccess && 
             metrics.transcriptionTime < 30000 && 
             metrics.annotationTime < 45000 &&
             metrics.audioQuality >= 80 &&
             medicalQuality.encryptionSuccess &&
             !medicalQuality.patientDataExposure &&
             medicalQuality.swissMedicalCompliance;
    }
  };
}