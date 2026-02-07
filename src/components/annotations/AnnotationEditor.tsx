import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Calendar, Clock, Loader2 } from "lucide-react";
import type { Annotation } from "@/types";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface AnnotationEditorProps {
  annotation: Annotation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (annotation: Annotation) => void;
  isSaving?: boolean;
}

export function AnnotationEditor({
  annotation,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: AnnotationEditorProps) {
  const [content, setContent] = useState(annotation.content);

  const handleSave = () => {
    onSave({
      ...annotation,
      content,
      was_content_edited: true,
    });
  };

  // Format the date - handle both string dates and visit_date field
  const formatAnnotationDate = () => {
    try {
      // Use visit_date if available, fallback to created_at
      const dateStr = annotation.visit_date || annotation.created_at;
      if (!dateStr) return "Date inconnue";
      
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch {
      return "Date inconnue";
    }
  };

  // Get time from visit_time field
  const getTime = () => {
    return annotation.visit_time || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span>Annotation du</span>
            <span className="flex items-center gap-2 text-muted-foreground font-normal">
              <Calendar className="w-4 h-4" />
              {formatAnnotationDate()}
              {getTime() && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  {getTime().slice(0, 5)}
                </>
              )}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
