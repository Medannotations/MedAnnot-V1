import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Check, X, Sparkles } from "lucide-react";

interface TranscriptionReviewProps {
  transcription: string;
  onConfirm: (editedTranscription: string) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export function TranscriptionReview({ 
  transcription, 
  onConfirm, 
  onCancel,
  isGenerating 
}: TranscriptionReviewProps) {
  const [editedTranscription, setEditedTranscription] = useState(transcription);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    onConfirm(editedTranscription);
  };

  const handleReset = () => {
    setEditedTranscription(transcription);
    setIsEditing(false);
  };

  const hasChanges = editedTranscription !== transcription;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="w-5 h-5 text-secondary" />
          Vérification de la transcription
        </CardTitle>
        <CardDescription>
          Voici ce qui a été compris. Vous pouvez corriger si nécessaire avant la génération.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={editedTranscription}
            onChange={(e) => {
              setEditedTranscription(e.target.value);
              setIsEditing(true);
            }}
            className="min-h-[200px] resize-y"
            placeholder="Transcription..."
            disabled={isGenerating}
          />
          {hasChanges && (
            <div className="absolute top-2 right-2">
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                Modifié
              </span>
            </div>
          )}
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Pencil className="w-4 h-4" />
            <span>Vous avez modifié la transcription</span>
            <Button variant="link" size="sm" onClick={handleReset} className="h-auto p-0">
              Réinitialiser
            </Button>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isGenerating} className="sm:flex-1">
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={isGenerating || !editedTranscription.trim()} className="sm:flex-1">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Valider et générer l'annotation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
