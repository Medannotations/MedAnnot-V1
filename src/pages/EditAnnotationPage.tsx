import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Copy, Calendar, Clock, User, FileText, Timer } from "lucide-react";
import { useAnnotation, useUpdateAnnotation } from "@/hooks/useAnnotations";
import { Skeleton } from "@/components/ui/skeleton";
import { PhraseTemplatePicker } from "@/components/annotations/PhraseTemplatePicker";
import { cleanAnnotationForCopy } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function EditAnnotationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: annotation, isLoading } = useAnnotation(id);
  const updateAnnotation = useUpdateAnnotation();
  
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [originalVisitDate, setOriginalVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [originalVisitTime, setOriginalVisitTime] = useState("");
  const [visitDuration, setVisitDuration] = useState("");
  const [originalVisitDuration, setOriginalVisitDuration] = useState("");

  useEffect(() => {
    if (annotation) {
      setContent(annotation.content);
      setOriginalContent(annotation.content);
      setVisitDate(annotation.visit_date || "");
      setOriginalVisitDate(annotation.visit_date || "");
      setVisitTime(annotation.visit_time ? annotation.visit_time.slice(0, 5) : "");
      setOriginalVisitTime(annotation.visit_time ? annotation.visit_time.slice(0, 5) : "");
      setVisitDuration(annotation.visit_duration ? String(annotation.visit_duration) : "");
      setOriginalVisitDuration(annotation.visit_duration ? String(annotation.visit_duration) : "");
    }
  }, [annotation]);

  const handleSave = async () => {
    if (!id || !annotation) return;

    try {
      await updateAnnotation.mutateAsync({
        id,
        content,
        was_content_edited: content !== originalContent,
        visit_date: visitDate || undefined,
        visit_time: visitTime ? `${visitTime}:00` : undefined,
        visit_duration: visitDuration ? parseInt(visitDuration) : undefined,
      });
      
      toast({
        title: "Annotation sauvegardée",
        description: "Les modifications ont été enregistrées.",
      });
      
      navigate("/app/annotations");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder l'annotation.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cleanAnnotationForCopy(content));
    toast({
      title: "Copié !",
      description: "L'annotation a été copiée dans le presse-papier.",
    });
  };

  const insertTemplate = (templateContent: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = content;
    
    const newValue = 
      currentValue.substring(0, start) + 
      templateContent + 
      currentValue.substring(end);
    
    setContent(newValue);
    
    // Remettre le focus et positionner le curseur après le template
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + templateContent.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
    
    toast({
      title: "Phrase insérée",
      description: "Le template a été ajouté à l'annotation.",
    });
  };

  const hasChanges = content !== originalContent || visitDate !== originalVisitDate || visitTime !== originalVisitTime || visitDuration !== originalVisitDuration;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!annotation) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Annotation non trouvée</p>
        <Button asChild>
          <Link to="/app/annotations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux annotations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app/annotations">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier l'annotation</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <User className="w-4 h-4" />
              {annotation.patients?.last_name} {annotation.patients?.first_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copier
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateAnnotation.isPending}
          >
            {updateAnnotation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Editable visit info */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="visit-date" className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Date de visite
              </Label>
              <Input
                id="visit-date"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visit-time" className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Heure de visite
              </Label>
              <Input
                id="visit-time"
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visit-duration" className="text-xs text-muted-foreground flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                Durée (minutes)
              </Label>
              <Input
                id="visit-duration"
                type="number"
                min="1"
                max="480"
                value={visitDuration}
                onChange={(e) => setVisitDuration(e.target.value)}
                placeholder="Ex: 30"
              />
            </div>
          </div>
          {(annotation.was_content_edited || annotation.audio_duration) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {annotation.was_content_edited && (
                <Badge variant="secondary">Modifiée</Badge>
              )}
              {annotation.audio_duration && (
                <Badge variant="outline">
                  Audio: {Math.floor(annotation.audio_duration / 60)}:{String(annotation.audio_duration % 60).padStart(2, "0")}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-medium">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contenu de l'annotation
            </span>
            <PhraseTemplatePicker onSelect={insertTemplate} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm leading-relaxed"
            placeholder="Contenu de l'annotation..."
          />
          
          {hasChanges && (
            <p className="text-sm text-muted-foreground mt-2">
              Modifications non sauvegardées
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions bottom */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to="/app/annotations">Annuler</Link>
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || updateAnnotation.isPending}
        >
          {updateAnnotation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
}
