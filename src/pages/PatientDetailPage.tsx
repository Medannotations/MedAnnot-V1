import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Plus, Trash2, Calendar, Clock, Save } from "lucide-react";
import { VoiceRecorder } from "@/components/annotations/VoiceRecorder";
import { AnnotationEditor } from "@/components/annotations/AnnotationEditor";
import type { Patient, Annotation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PATIENTS_KEY = "nursevoice_patients";
const ANNOTATIONS_KEY = "nursevoice_annotations";

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewAnnotation, setIsNewAnnotation] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    pathologies: "",
  });
  const [newAnnotationDate, setNewAnnotationDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [newAnnotationTime, setNewAnnotationTime] = useState(
    format(new Date(), "HH:mm")
  );
  const [transcription, setTranscription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedPatients = localStorage.getItem(PATIENTS_KEY);
    const savedAnnotations = localStorage.getItem(ANNOTATIONS_KEY);

    if (savedPatients) {
      const patients: Patient[] = JSON.parse(savedPatients);
      const foundPatient = patients.find((p) => p.id === patientId);
      if (foundPatient) {
        setPatient(foundPatient);
        setEditForm({
          firstName: foundPatient.firstName,
          lastName: foundPatient.lastName,
          address: foundPatient.address,
          pathologies: foundPatient.pathologies,
        });
      }
    }

    if (savedAnnotations) {
      const allAnnotations: Annotation[] = JSON.parse(savedAnnotations);
      setAnnotations(
        allAnnotations
          .filter((a) => a.patientId === patientId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  }, [patientId]);

  const savePatient = (updatedPatient: Patient) => {
    const savedPatients = localStorage.getItem(PATIENTS_KEY);
    if (savedPatients) {
      const patients: Patient[] = JSON.parse(savedPatients);
      const updatedPatients = patients.map((p) =>
        p.id === updatedPatient.id ? updatedPatient : p
      );
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients));
      setPatient(updatedPatient);
    }
  };

  const saveAnnotations = (updatedAnnotations: Annotation[]) => {
    const savedAnnotations = localStorage.getItem(ANNOTATIONS_KEY);
    let allAnnotations: Annotation[] = savedAnnotations
      ? JSON.parse(savedAnnotations)
      : [];
    
    // Remove annotations for this patient
    allAnnotations = allAnnotations.filter((a) => a.patientId !== patientId);
    // Add updated annotations
    allAnnotations = [...allAnnotations, ...updatedAnnotations];
    
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(allAnnotations));
    setAnnotations(
      updatedAnnotations.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const handleUpdatePatient = () => {
    if (!patient) return;

    const updatedPatient: Patient = {
      ...patient,
      ...editForm,
      updatedAt: new Date(),
    };

    savePatient(updatedPatient);
    setIsEditing(false);
    toast({
      title: "Patient mis à jour",
      description: "Les informations ont été sauvegardées.",
    });
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    handleGenerateAnnotation(text);
  };

  const handleGenerateAnnotation = async (text: string) => {
    if (!patient) return;

    setIsGenerating(true);
    
    // Simulate AI generation (in production, this would call an API)
    const structure = localStorage.getItem("nursevoice_annotation_structure") || "";
    const examples = localStorage.getItem("nursevoice_example_annotations") || "[]";
    
    // Simulated generation with a delay
    setTimeout(() => {
      const generatedAnnotation = `**Date de visite:** ${format(new Date(newAnnotationDate), "d MMMM yyyy", { locale: fr })} à ${newAnnotationTime}
**Patient:** ${patient.lastName} ${patient.firstName}
${patient.pathologies ? `**Pathologies connues:** ${patient.pathologies}` : ""}

---

**1. Motif de la visite**
${text.split(".").slice(0, 2).join(". ")}.

**2. Observations cliniques**
- État général: Patient conscient et orienté
- Signes vitaux: À compléter
- Observations spécifiques: ${text}

**3. Soins prodigués**
Soins infirmiers effectués selon prescription.

**4. Évaluation**
État stable, surveillance à poursuivre.

**5. Plan de soins**
Prochaine visite à planifier.`;

      setGeneratedContent(generatedAnnotation);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveAnnotation = () => {
    if (!generatedContent.trim()) return;

    const newAnnotation: Annotation = {
      id: crypto.randomUUID(),
      patientId: patientId!,
      date: new Date(newAnnotationDate),
      time: newAnnotationTime,
      content: generatedContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    saveAnnotations([...annotations, newAnnotation]);
    
    toast({
      title: "Annotation sauvegardée",
      description: "L'annotation a été ajoutée au dossier du patient.",
    });

    setIsNewAnnotation(false);
    setTranscription("");
    setGeneratedContent("");
  };

  const handleUpdateAnnotation = (updatedAnnotation: Annotation) => {
    const updatedAnnotations = annotations.map((a) =>
      a.id === updatedAnnotation.id ? { ...updatedAnnotation, updatedAt: new Date() } : a
    );
    saveAnnotations(updatedAnnotations);
    setSelectedAnnotation(null);
    toast({
      title: "Annotation mise à jour",
      description: "Les modifications ont été sauvegardées.",
    });
  };

  const handleDeleteAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter((a) => a.id !== id);
    saveAnnotations(updatedAnnotations);
    toast({
      title: "Annotation supprimée",
      description: "L'annotation a été supprimée.",
    });
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Patient non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/patients">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {patient.lastName} {patient.firstName}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-muted-foreground text-sm">
            {patient.address && <span>{patient.address}</span>}
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Patient info */}
      {patient.pathologies && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-card-foreground mb-2">Pathologies connues</h3>
            <p className="text-muted-foreground">{patient.pathologies}</p>
          </CardContent>
        </Card>
      )}

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
              isGenerating={isGenerating}
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
                  <Button onClick={handleSaveAnnotation}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateAnnotation(transcription)}
                  >
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
        {annotations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Aucune annotation pour ce patient</p>
              <p className="text-sm">Créez votre première annotation ci-dessus</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {annotations.map((annotation) => (
              <Card key={annotation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(annotation.date), "d MMMM yyyy", { locale: fr })}
                        {annotation.time && (
                          <>
                            <Clock className="w-4 h-4 ml-2" />
                            {annotation.time}
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
                        onClick={() => setSelectedAnnotation(annotation)}
                      >
                        Voir / Éditer
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnnotation(annotation.id)}
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

      {/* Edit Patient Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Nom</Label>
                <Input
                  id="edit-lastName"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">Prénom</Label>
                <Input
                  id="edit-firstName"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdatePatient}>Sauvegarder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Edit Annotation Dialog */}
      {selectedAnnotation && (
        <AnnotationEditor
          annotation={selectedAnnotation}
          isOpen={!!selectedAnnotation}
          onClose={() => setSelectedAnnotation(null)}
          onSave={handleUpdateAnnotation}
        />
      )}
    </div>
  );
}
