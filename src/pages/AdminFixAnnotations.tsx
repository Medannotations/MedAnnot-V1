import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAnnotations } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { annotations as annotationsApi } from "@/services/api";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminFixAnnotations() {
  const { data: allAnnotations, isLoading: loadingAnnotations, refetch } = useAnnotations();
  const { data: patients, isLoading: loadingPatients } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [fixing, setFixing] = useState(false);

  const orphanAnnotations = allAnnotations?.filter(a => !a.patient_id) || [];

  const handleFixAll = async () => {
    if (!selectedPatientId) {
      toast({
        title: "Erreur",
        description: "Sélectionnez un patient",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Voulez-vous assigner ${orphanAnnotations.length} annotations au patient sélectionné ?`)) {
      return;
    }

    setFixing(true);
    try {
      // Mettre à jour toutes les annotations orphelines
      await Promise.all(
        orphanAnnotations.map(annotation =>
          annotationsApi.update(annotation.id, { patientId: selectedPatientId })
        )
      );

      toast({
        title: "✅ Annotations corrigées",
        description: `${orphanAnnotations.length} annotations ont été assignées au patient.`,
      });

      // Recharger les données
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de corriger les annotations",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  if (loadingAnnotations || loadingPatients) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Correction des annotations orphelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {orphanAnnotations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune annotation orpheline</h3>
              <p className="text-muted-foreground">
                Toutes les annotations sont correctement assignées à des patients.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>{orphanAnnotations.length} annotations</strong> n'ont pas de patient assigné.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Annotations concernées:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {orphanAnnotations.map(annotation => (
                    <div key={annotation.id} className="p-3 bg-muted rounded-lg text-sm">
                      <p className="text-xs text-muted-foreground mb-1">
                        {annotation.visit_date} - {annotation.created_at}
                      </p>
                      <p className="line-clamp-2">
                        {annotation.content.substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Assigner toutes les annotations à ce patient:
                  </label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients?.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.last_name} {patient.first_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleFixAll}
                  disabled={!selectedPatientId || fixing}
                  className="w-full"
                  size="lg"
                >
                  {fixing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Correction en cours...
                    </>
                  ) : (
                    <>Corriger toutes les annotations</>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
