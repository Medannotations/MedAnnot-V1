import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  User,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { usePatients, type Patient } from "@/hooks/usePatients";
import { useUserConfiguration, useExampleAnnotations } from "@/hooks/useConfiguration";
import { useCreateAnnotation, useAnnotationsByPatient } from "@/hooks/useAnnotations";
import { transcribeAudio, generateAnnotation } from "@/services/aiService";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { VoiceRecorderDual } from "@/components/annotations/VoiceRecorderDual";
import { TranscriptionReview } from "@/components/annotations/TranscriptionReview";
import { AnnotationResult } from "@/components/annotations/AnnotationResult";
import { EmptyState } from "@/components/ui/empty-state";
import { usePersistedAnnotationState } from "@/hooks/usePersistedAnnotationState";

type Step = "patient" | "visit" | "record" | "transcription" | "result";

const STEPS: { key: Step; label: string; number: number }[] = [
  { key: "patient", label: "Patient", number: 1 },
  { key: "visit", label: "Visite", number: 2 },
  { key: "record", label: "Audio", number: 3 },
  { key: "transcription", label: "Transcription", number: 4 },
  { key: "result", label: "Annotation", number: 5 },
];

export default function CreateAnnotationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("patient");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [visitTime, setVisitTime] = useState(format(new Date(), "HH:mm"));
  const [visitDuration, setVisitDuration] = useState<number | undefined>();
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  const { data: patients } = usePatients();
  const { data: config } = useUserConfiguration();
  const { data: examples } = useExampleAnnotations();
  const { data: patientAnnotations } = useAnnotationsByPatient(selectedPatient?.id);
  const createAnnotation = useCreateAnnotation();
  const { saveState, loadState, clearState, hasPersistedState, isRestored } = usePersistedAnnotationState();

  // Check for persisted state on mount
  useEffect(() => {
    if (isRestored && hasPersistedState()) {
      setShowRestoreDialog(true);
    }
  }, [isRestored, hasPersistedState]);

  // Save state whenever important fields change
  useEffect(() => {
    if (isRestored && (transcription || annotation)) {
      saveState({
        selectedPatientId: selectedPatient?.id || null,
        visitDate,
        visitTime,
        visitDuration,
        audioDuration,
        transcription,
        annotation,
        step,
      });
    }
  }, [transcription, annotation, step, selectedPatient, visitDate, visitTime, visitDuration, audioDuration, isRestored, saveState]);

  const handleRestoreState = () => {
    const state = loadState();
    if (!state) return;

    // Find patient if exists
    if (state.selectedPatientId && patients) {
      const patient = patients.find(p => p.id === state.selectedPatientId);
      if (patient) setSelectedPatient(patient);
    }

    setVisitDate(state.visitDate);
    setVisitTime(state.visitTime);
    setVisitDuration(state.visitDuration);
    setAudioDuration(state.audioDuration);
    setTranscription(state.transcription);
    setAnnotation(state.annotation);
    setStep(state.step);
    setShowRestoreDialog(false);

    toast({
      title: "Brouillon restauré",
      description: "Votre travail en cours a été récupéré.",
    });
  };

  const handleDiscardState = () => {
    clearState();
    setShowRestoreDialog(false);
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const filteredPatients = patients?.filter(
    (p) =>
      p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAudioReady = async (audioBlob: Blob, duration: number) => {
    setAudioDuration(duration);
    setIsTranscribing(true);
    
    try {
      const text = await transcribeAudio(audioBlob);
      setTranscription(text);
      setStep("transcription");
    } catch (error: any) {
      toast({ 
        title: "Erreur de transcription", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateAnnotation = async (editedTranscription: string) => {
    if (!selectedPatient || !config) {
      toast({
        title: "Configuration manquante",
        description: "Veuillez configurer votre structure d'annotation",
        variant: "destructive",
      });
      return;
    }

    setTranscription(editedTranscription);
    setIsGenerating(true);

    try {
      const result = await generateAnnotation({
        transcription: editedTranscription,
        patientName: `${selectedPatient.last_name} ${selectedPatient.first_name}`,
        patientAddress: selectedPatient.address || "",
        patientPathologies: selectedPatient.pathologies || "",
        visitDate,
        visitTime,
        visitDuration,
        userStructure: config.annotation_structure,
        userExamples: examples?.map((e) => e.content) || [],

        // Pass patient-specific examples (only active ones)
        patientExamples: selectedPatient.exampleAnnotations
          ?.filter((ex) => ex.isLearningExample)
          .map((ex) => ({
            content: ex.content,
            visitDate: ex.visitDate,
            context: ex.context,
          })) || [],

        // Pass 5 most recent annotations for context
        recentAnnotations: patientAnnotations
          ?.slice(0, 5)
          .map((a) => ({
            date: a.visit_date,
            content: a.content,
          })) || [],
      });
      setAnnotation(result);
      setStep("result");
    } catch (error: any) {
      toast({
        title: "Erreur de génération",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerateAnnotation(transcription);
  };

  const handleSave = async () => {
    if (!selectedPatient) return;

    setIsSaving(true);
    try {
      await createAnnotation.mutateAsync({
        patient_id: selectedPatient.id,
        visit_date: visitDate,
        visit_time: visitTime,
        visit_duration: visitDuration,
        transcription: "", // ⚠️ SÉCURITÉ: Transcription NON sauvegardée (secret médical)
        content: annotation,
        structure_used: config?.annotation_structure,
        audio_duration: audioDuration,
        was_transcription_edited: false,
        was_content_edited: false,
      });
      clearState(); // Clear persisted state on successful save
      toast({
        title: "✓ Annotation enregistrée",
        description: "L'annotation a été sauvegardée avec succès."
      });
      navigate("/app/annotations");
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/annotations")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouvelle annotation</h1>
          {selectedPatient && (
            <p className="text-muted-foreground">
              {selectedPatient.last_name} {selectedPatient.first_name}
            </p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {STEPS.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s.number}
            </div>
            <span
              className={cn(
                "ml-2 text-sm",
                index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            {index < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden flex items-center justify-between text-sm mb-4">
        <span className="text-muted-foreground">
          Étape {currentStepIndex + 1} sur {STEPS.length}
        </span>
        <span className="font-medium text-foreground">
          {STEPS[currentStepIndex]?.label}
        </span>
      </div>

      {/* Step 1: Patient Selection */}
      {step === "patient" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Pour quel patient ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Rechercher un patient..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            
            {!filteredPatients || filteredPatients.length === 0 ? (
              <EmptyState
                icon={User}
                title="Aucun patient trouvé"
                description="Créez d'abord un patient pour pouvoir enregistrer une annotation"
                actionLabel="Créer un patient"
                actionHref="/app/patients"
              />
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer hover:bg-accent transition-all",
                      selectedPatient?.id === p.id && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {p.last_name} {p.first_name}
                        </p>
                        {p.pathologies && (
                          <p className="text-sm text-muted-foreground truncate">
                            {p.pathologies}
                          </p>
                        )}
                      </div>
                      {selectedPatient?.id === p.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              onClick={() => setStep("visit")} 
              disabled={!selectedPatient} 
              className="w-full"
            >
              Continuer
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Visit Info */}
      {step === "visit" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informations de la visite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de la visite
                </Label>
                <Input 
                  type="date" 
                  value={visitDate} 
                  onChange={(e) => setVisitDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Heure de la visite
                </Label>
                <Input 
                  type="time" 
                  value={visitTime} 
                  onChange={(e) => setVisitTime(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Durée estimée (minutes) - optionnel</Label>
              <Input 
                type="number" 
                placeholder="45" 
                value={visitDuration || ""} 
                onChange={(e) => setVisitDuration(parseInt(e.target.value) || undefined)} 
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("patient")}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button onClick={() => setStep("record")} className="flex-1">
                Continuer
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Recording */}
      {step === "record" && (
        <Card>
          <CardHeader>
            <CardTitle>Enregistrement vocal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <VoiceRecorderDual 
              onAudioReady={handleAudioReady}
              isProcessing={isTranscribing}
            />
            
            {isTranscribing && (
              <div className="flex items-center justify-center gap-3 py-4 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Transcription en cours...</span>
              </div>
            )}
            
            <Button variant="outline" onClick={() => setStep("visit")} className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Transcription Review */}
      {step === "transcription" && (
        <TranscriptionReview
          transcription={transcription}
          onConfirm={handleGenerateAnnotation}
          onCancel={() => setStep("record")}
          isGenerating={isGenerating}
        />
      )}

      {/* Step 5: Result */}
      {step === "result" && (
        <AnnotationResult
          transcription={transcription}
          annotation={annotation}
          onAnnotationChange={setAnnotation}
          onRegenerate={handleRegenerate}
          onSave={handleSave}
          onCancel={() => setStep("transcription")}
          isProcessing={isGenerating}
          isSaving={isSaving}
        />
      )}

      {/* Restore Draft Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Brouillon détecté
            </DialogTitle>
            <DialogDescription>
              Vous avez un brouillon d'annotation non terminé. Voulez-vous le restaurer pour continuer où vous vous êtes arrêté ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleDiscardState}>
              Recommencer
            </Button>
            <Button onClick={handleRestoreState}>
              Restaurer le brouillon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
