import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Calendar, Clock } from "lucide-react";
import type { Annotation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AnnotationEditorProps {
  annotation: Annotation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (annotation: Annotation) => void;
}

export function AnnotationEditor({
  annotation,
  isOpen,
  onClose,
  onSave,
}: AnnotationEditorProps) {
  const [content, setContent] = useState(annotation.content);

  const handleSave = () => {
    onSave({
      ...annotation,
      content,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span>Annotation du</span>
            <span className="flex items-center gap-2 text-muted-foreground font-normal">
              <Calendar className="w-4 h-4" />
              {format(new Date(annotation.date), "d MMMM yyyy", { locale: fr })}
              {annotation.time && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  {annotation.time}
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
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
