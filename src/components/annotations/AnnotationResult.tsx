import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Copy, 
  Check, 
  Pencil, 
  RotateCcw, 
  Save, 
  X,
  FileText,
  Mic,
  Loader2
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

interface AnnotationResultProps {
  transcription: string;
  annotation: string;
  onAnnotationChange: (annotation: string) => void;
  onRegenerate: () => void;
  onSave: () => void;
  onCancel: () => void;
  isProcessing: boolean;
  isSaving: boolean;
}

export function AnnotationResult({
  transcription,
  annotation,
  onAnnotationChange,
  onRegenerate,
  onSave,
  onCancel,
  isProcessing,
  isSaving
}: AnnotationResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-4">
      {/* Desktop: Side by side */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4">
        {/* Transcription (read-only) */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Transcription originale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {transcription}
            </div>
          </CardContent>
        </Card>

        {/* Annotation (editable) */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Annotation générée
              </CardTitle>
              <CopyButton text={annotation} />
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={annotation}
              onChange={(e) => {
                onAnnotationChange(e.target.value);
                setIsEditing(true);
              }}
              className="min-h-[400px] resize-y"
              disabled={isProcessing}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mobile/Tablet: Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="annotation">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcription" className="gap-2">
              <Mic className="w-4 h-4" />
              Transcription
            </TabsTrigger>
            <TabsTrigger value="annotation" className="gap-2">
              <FileText className="w-4 h-4" />
              Annotation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcription" className="mt-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transcription originale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {transcription}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="annotation" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Annotation générée</CardTitle>
                  <CopyButton text={annotation} />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={annotation}
                  onChange={(e) => {
                    onAnnotationChange(e.target.value);
                    setIsEditing(true);
                  }}
                  className="min-h-[300px] resize-y"
                  disabled={isProcessing}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={isProcessing || isSaving}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={isProcessing || isSaving}>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Régénérer
        </Button>
        <div className="flex-1" />
        <Button onClick={onSave} disabled={isProcessing || isSaving} className="sm:min-w-[200px]">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer l'annotation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
