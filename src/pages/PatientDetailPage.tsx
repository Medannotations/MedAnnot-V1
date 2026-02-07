import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Plus, Trash2, Calendar, Clock, Save, User, FileText, Archive, ArchiveRestore, Loader2, BookOpen } from "lucide-react";
import { VoiceRecorder } from "@/components/annotations/VoiceRecorder";
import { AnnotationViewModal } from "@/components/annotations/AnnotationViewModal";
import { PatientExamplesTab } from "@/components/patient/PatientExamplesTab";
import { usePatient, useUpdatePatient, useArchivePatient } from "@/hooks/usePatients";
import { useAnnotationsByPatient, useCreateAnnotation, useDeleteAnnotation, type AnnotationWithPatient } from "@/hooks/useAnnotations";
import { useUserConfiguration, useExampleAnnotations } from "@/hooks/useConfiguration";
import { transcribeAudio, generateAnnotation } from "@/services/aiService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  
  // Récupération des données depuis Supabase
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: annotations, isLoading: annotationsLoading } = useAnnotationsByPatient(patientId);
  const { data: config } = useUserConfiguration();
  const { data: globalExamples = [] } = useExampleAnnotations();
  
  // Mutations
  const updatePatient = useUpdatePatient();
  const archivePatient = useArchivePatient();
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();
  
  // États UI
  const [isEditing, setIsEditing] = useState(false);
  const [isNewAnnotation, setIsNewAnnotation] = useState(false);
  const [viewAnnotation, setViewAnnotation] = useState<AnnotationWithPatient | null>(null);
  const [deleteAnnotationId, setDeleteAnnotationId] = useState<string | null>(null);
  
  // Formulaire d'édition patient
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    address: "",
    postal_code: "",
    city: "",
    pathologies: "",
    notes: "",
  });
  
  // Formulaire nouvelle annotation
  const [newAnnotationDate, setNewAnnotationDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newAnnotationTime, setNewAnnotationTime] = useState(format(new Date(), "HH:mm"));
  const [transcription, setTranscription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialiser le formulaire d'édition quand on ouvre le dialog
  const handleOpenEdit = () => {
    if (patient) {
      setEditForm({
        first_name: patient.first_name,
        last_name: patient.last_name,
        address: patient.address || "",
        postal_code: patient.postal_code || "",
        city: patient.city || "",
        pathologies: patient.pathologies || "",
        notes: patient.notes || "",
      });
      setIsEditing(true);
    }
  };

  const handleUpdatePatient = async () => {
    if (!patient) return;

    try {
      await updatePatient.mutateAsync({
        id: patient.id,
        ...editForm,
      });
      setIsEditing(false);
      toast({
        title: "Patient mis à jour",
        description: "Les informations ont été sauvegardées.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le patient.",
        variant: "destructive",
      });
    }
  };

  const handleArchivePatient = async (archive: boolean) => {
    if (!patient) return;
    try {
      await archivePatient.mutateAsync({ id: patient.id, isArchived: archive });
      toast({
        title: archive ? "Patient archivé" : "Patient restauré",
        description: archive 
          ? "Le patient a été archivé." 
          : "Le patient a été restauré.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTranscriptionComplete = async (text: string) => {
    setTranscription(text);
    await handleGenerateAnnotation(text);
  };

  const handleGenerateAnnotation = async (text: string) => {
    if (!patient || !config) {
      toast({
        title: "Configuration manquante",
        description: "Veuillez configurer votre structure d'annotation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateAnnotation({
        transcription: text,
        patientName: `${patient.last_name} ${patient.first_name}`,
        patientAddress: patient.address || "",
        patientPostalCode: patient.postal_code || "",
        patientCity: patient.city || "",
        patientPathologies: patient.pathologies || "",
        visitDate: newAnnotationDate,
        visitTime: newAnnotationTime,
        userStructure: config.annotation_structure,
        userExamples: globalExamples.map(e => e.content),
        patientExamples: (patient.example_annotations as any[])?.filter(ex => ex?.isLearningExample).map(ex => ({
          content: ex.content,
          visitDate: ex.visitDate,
          context: ex.context,
        })) || [],
        recentAnnotations: annotations?.slice(0, 5).map(a => ({
          date: a.visit_date,
          content: a.content,
        })) || [],
      });
      
      setGeneratedContent(result);
    } catch (error: any) {
      toast({
        title: "Erreur de génération",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAnnotation = async () => {
    if (!generatedContent.trim() || !patient) return;

    try {
      await createAnnotation.mutateAsync({
        patient_id: patient.id,
        visit_date: newAnnotationDate,
        visit_time: newAnnotationTime,
        content: generatedContent,
        transcription: "", // Ne pas sauvegarder la transcription (secret médical)
        structure_used: config?.annotation_structure,
      });
      
      toast({
        title: "Annotation sauvegardée",
        description: "L'annotation a été ajoutée au dossier du patient.",
      });

      setIsNewAnnotation(false);
      setTranscription("");
      setGeneratedContent("");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnotation = async () => {
    if (!deleteAnnotationId) return;
    try {
      await deleteAnnotation.mutateAsync(deleteAnnotationId);
      toast({
        title: "Annotation supprimée",
        description: "L'annotation a été supprimée.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteAnnotationId(null);
    }
  };

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Patient non trouvé</p>
        <Button asChild variant="outline">
          <Link to="/app/patients">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux patients
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/patients">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {patient.last_name} {patient.first_name}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground text-sm">
              {patient.address && <span>{patient.address}</span>}
              {(patient.postal_code || patient.city) && (
                <span>{patient.postal_code} {patient.city}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          {patient.is_archived ? (
            <Button variant="outline" onClick={() => handleArchivePatient(false)}>
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Restaurer
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleArchivePatient(true)}>
              <Archive className="w-4 h-4 mr-2" />
              Archiver
            </Button>
          )}
        </div>
      </div>

      {/* Info cards */}
      {(patient.pathologies || patient.notes) && (
        <div className="grid md:grid-cols-2 gap-4">
          {patient.pathologies && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-card-foreground mb-2">Pathologies connues</h3>
                <p className="text-muted-foreground">{patient.pathologies}</p>
              </CardContent>
            </Card>
          )}
          {patient.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-card-foreground mb-2">Notes</h3>
                <p className="text-muted-foreground">{patient.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="annotations" className="w-full">
        <TabsList>
          <TabsTrigger value="annotations" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Annotations ({annotations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Exemples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="annotations" className="mt-6 space-y-6">
          {/* New Annotation Section */}
          {!isNewAnnotation ? (
            <Button onClick={() => setIsNewAnnotation(true)} className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle annotation
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle annotation</CardTitle>
                <CardDescription>
                  Enregistrez votre observation vocale et laissez l'IA générer l'annotation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date de visite
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAnnotationDate}
                      onChange={(e) => setNewAnnotationDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Heure
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAnnotationTime}
                      onChange={(e) => setNewAnnotationTime(e.target.value)}
                    />
                  </div>
                </div>

                <VoiceRecorder 
                  onTranscriptionComplete={handleTranscriptionComplete}
                  isGenerating={isTranscribing || isGenerating}
                />

                {transcription && (
                  <div className="space-y-2">
                    <Label>Transcription</Label>
                    <p className="p-3 bg-muted rounded-lg text-sm">{transcription}</p>
                  </div>
                )}

                {generatedContent && (
                  <div className="space-y-2">
                    <Label>Annotation générée</Label>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[300px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveAnnotation} disabled={createAnnotation.isPending}>
                        {createAnnotation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Enregistrer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleGenerateAnnotation(transcription)}
                        disabled={isGenerating}
                      >
                        {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Régénérer
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsNewAnnotation(false);
                          setTranscription("");
                          setGeneratedContent("");
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Annotations List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Historique des annotations</h2>
            {annotationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : annotations?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Aucune annotation pour ce patient</p>
                  <p className="text-sm">Créez votre première annotation ci-dessus</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {annotations?.map((annotation) => (
                  <Card key={annotation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(annotation.visit_date), "d MMMM yyyy", { locale: fr })}
                            {annotation.visit_time && (
                              <>
                                <Clock className="w-4 h-4 ml-2" />
                                {annotation.visit_time.slice(0, 5)}
                              </>
                            )}
                          </div>
                          <p className="text-card-foreground line-clamp-3 whitespace-pre-line">
                            {annotation.content.substring(0, 200)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewAnnotation(annotation as AnnotationWithPatient)}
                          >
                            Voir
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteAnnotationId(annotation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="mt-6">
          <PatientExamplesTab 
            patient={patient} 
            onUpdate={(updatedPatient) => {
              // Le hook se charge du refresh automatique
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-last_name">Nom *</Label>
                <Input
                  id="edit-last_name"
                  value={editForm.last_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, last_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-first_name">Prénom *</Label>
                <Input
                  id="edit-first_name"
                  value={editForm.first_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, first_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-postal_code">Code postal</Label>
                <Input
                  id="edit-postal_code"
                  value={editForm.postal_code}
                  onChange={(e) =>
                    setEditForm({ ...editForm, postal_code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">Ville</Label>
                <Input
                  id="edit-city"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pathologies">Pathologies connues</Label>
              <Textarea
                id="edit-pathologies"
                value={editForm.pathologies}
                onChange={(e) =>
                  setEditForm({ ...editForm, pathologies: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                placeholder="Notes internes..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpdatePatient}
                disabled={updatePatient.isPending}
              >
                {updatePatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Annotation Modal */}
      {viewAnnotation && (
        <AnnotationViewModal
          annotation={viewAnnotation}
          isOpen={!!viewAnnotation}
          onClose={() => setViewAnnotation(null)}
          onCopy={() => {
            navigator.clipboard.writeText(viewAnnotation.content);
            toast({ title: "Annotation copiée" });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteAnnotationId} onOpenChange={() => setDeleteAnnotationId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette annotation ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L'annotation sera définitivement supprimée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteAnnotationId(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAnnotation}
              disabled={deleteAnnotation.isPending}
            >
              {deleteAnnotation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
