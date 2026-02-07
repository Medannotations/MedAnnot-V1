import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Copy, FileText, Info, Shield } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { AnnotationWithPatient } from "@/hooks/useAnnotations";

interface AnnotationViewModalProps {
  annotation: AnnotationWithPatient;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export function AnnotationViewModal({
  annotation,
  isOpen,
  onClose,
  onCopy,
}: AnnotationViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex flex-col gap-1">
            <span className="text-xl">
              {annotation.patients.last_name} {annotation.patients.first_name}
            </span>
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(annotation.visit_date), "EEEE d MMMM yyyy", { locale: fr })}
              {annotation.visit_time && (
                <>
                  <span className="mx-1">à</span>
                  {annotation.visit_time.slice(0, 5)}
                </>
              )}
              {annotation.visit_duration && (
                <Badge variant="outline" className="ml-2">
                  {annotation.visit_duration} min
                </Badge>
              )}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 py-2 border-b">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-1" />
            Copier
          </Button>
        </div>

        <Tabs defaultValue="annotation" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start flex-shrink-0">
            <TabsTrigger value="annotation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Annotation
            </TabsTrigger>
            {/* Transcription retirée pour confidentialité médicale */}
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Informations
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="annotation" className="m-0 h-full">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap leading-relaxed">
                {annotation.content}
              </div>
            </TabsContent>

            {/* Onglet transcription supprimé - les transcriptions ne sont pas conservées pour protéger le secret médical */}

            <TabsContent value="info" className="m-0 h-full">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">
                      {format(new Date(annotation.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                    <p className="font-medium">
                      {format(new Date(annotation.updated_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date de visite</p>
                    <p className="font-medium">
                      {format(new Date(annotation.visit_date), "d MMMM yyyy", { locale: fr })}
                      {annotation.visit_time && ` à ${annotation.visit_time.slice(0, 5)}`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Durée de visite</p>
                    <p className="font-medium">
                      {annotation.visit_duration ? `${annotation.visit_duration} minutes` : "Non renseignée"}
                    </p>
                  </div>
                  {annotation.audio_duration && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Durée d'enregistrement</p>
                      <p className="font-medium">
                        {Math.floor(annotation.audio_duration / 60)}:{String(annotation.audio_duration % 60).padStart(2, "0")}
                      </p>
                    </div>
                  )}
                  {annotation.structure_used && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Structure utilisée</p>
                      <p className="font-medium">Structure personnalisée</p>
                    </div>
                  )}
                </div>

                {annotation.patients.pathologies && (
                  <div className="space-y-1 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Pathologies du patient</p>
                    <p className="font-medium">{annotation.patients.pathologies}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {annotation.was_transcription_edited && (
                    <Badge variant="secondary">Transcription modifiée</Badge>
                  )}
                  {annotation.was_content_edited && (
                    <Badge variant="secondary">Annotation modifiée</Badge>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Protection des données</p>
                      <p className="mt-1">
                        La transcription vocale brute n'est pas conservée pour protéger le secret médical. 
                        Seule l'annotation professionnelle structurée est stockée de manière sécurisée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
