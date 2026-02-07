import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Copy, Calendar, Clock, User, FileText } from "lucide-react";
import { useAnnotation, useUpdateAnnotation } from "@/hooks/useAnnotations";
import { Skeleton } from "@/components/ui/skeleton";
import { PhraseTemplatePicker } from "@/components/annotations/PhraseTemplatePicker";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function EditAnnotationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: annotation, isLoading } = useAnnotation(id);
  const updateAnnotation = useUpdateAnnotation();
  
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");

  useEffect(() => {
    if (annotation) {
      setContent(annotation.content);
      setOriginalContent(annotation.content);
    }
  }, [annotation]);

  const handleSave = async () => {
    if (!id || !annotation) return;
    
    try {
      await updateAnnotation.mutateAsync({
        id,
        content,
        was_content_edited: content !== originalContent,
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
    await navigator.clipboard.writeText(content);
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

  const hasChanges = content !== originalContent;

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
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {annotation.patients?.last_name} {annotation.patients?.first_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(parseISO(annotation.visit_date), "d MMMM yyyy", { locale: fr })}
              </span>
              {annotation.visit_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {annotation.visit_time.slice(0, 5)}
                </span>
              )}
            </div>
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

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        {annotation.was_content_edited && (
          <Badge variant="secondary">Modifiée</Badge>
        )}
        {annotation.visit_duration && (
          <Badge variant="outline">{annotation.visit_duration} min</Badge>
        )}
        {annotation.audio_duration && (
          <Badge variant="outline">
            Audio: {Math.floor(annotation.audio_duration / 60)}:{String(annotation.audio_duration % 60).padStart(2, "0")}
          </Badge>
        )}
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-medium">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
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
