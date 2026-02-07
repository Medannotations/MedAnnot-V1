import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Thermometer,
  Heart,
  Wind,
  Save,
  Edit3,
  AlertTriangle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  useTodayVitalSigns,
  useSaveVitalSigns,
  type VitalSigns,
} from "@/hooks/usePatientVitalSigns";
import { toast } from "@/hooks/use-toast";

interface PatientVitalSignsPanelProps {
  patientId: string;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

// Validation des valeurs impossibles
function validateVitalSigns(signs: VitalSigns): string[] {
  const alerts: string[] = [];

  if (signs.temperature !== undefined) {
    if (signs.temperature < 20 || signs.temperature > 45) {
      alerts.push(`Température impossible (${signs.temperature}°C)`);
    }
  }
  if (signs.heartRate !== undefined) {
    if (signs.heartRate < 20 || signs.heartRate > 250) {
      alerts.push(`Pouls impossible (${signs.heartRate} bpm)`);
    }
  }
  if (signs.systolicBP !== undefined) {
    if (signs.systolicBP < 40 || signs.systolicBP > 300) {
      alerts.push(`Tension systolique impossible (${signs.systolicBP})`);
    }
  }
  if (signs.diastolicBP !== undefined) {
    if (signs.diastolicBP < 20 || signs.diastolicBP > 200) {
      alerts.push(`Tension diastolique impossible (${signs.diastolicBP})`);
    }
  }
  if (signs.respiratoryRate !== undefined) {
    if (signs.respiratoryRate < 4 || signs.respiratoryRate > 60) {
      alerts.push(`FR impossible (${signs.respiratoryRate})`);
    }
  }
  if (signs.oxygenSaturation !== undefined) {
    if (signs.oxygenSaturation < 30 || signs.oxygenSaturation > 100) {
      alerts.push(`SaO₂ impossible (${signs.oxygenSaturation}%)`);
    }
  }
  if (signs.bloodSugar !== undefined) {
    if (signs.bloodSugar < 0.1 || signs.bloodSugar > 10) {
      alerts.push(`Glycémie impossible (${signs.bloodSugar})`);
    }
  }

  return alerts;
}

// Composant pour afficher un signe vital sous forme de badge
function VitalSignBadge({
  icon: Icon,
  value,
  unit,
  label,
  colorClass,
}: {
  icon: React.ElementType;
  value?: number;
  unit: string;
  label: string;
  colorClass: string;
}) {
  if (value === undefined || value === null) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        colorClass
      )}
    >
      <Icon className="w-4 h-4" />
      <div>
        <span className="font-semibold">{value}</span>
        <span className="text-xs ml-1">{unit}</span>
      </div>
    </div>
  );
}

export function PatientVitalSignsPanel({
  patientId,
  selectedDate = format(new Date(), "yyyy-MM-dd"),
  onDateChange,
}: PatientVitalSignsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: todayVitals, isLoading } = useTodayVitalSigns(
    patientId,
    selectedDate
  );
  const saveVitalSigns = useSaveVitalSigns();

  const [formData, setFormData] = useState<VitalSigns>({
    temperature: undefined,
    heartRate: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    respiratoryRate: undefined,
    oxygenSaturation: undefined,
    bloodSugar: undefined,
  });

  const hasVitalSigns = todayVitals && Object.keys(todayVitals).length > 0;

  const handleEdit = () => {
    setFormData({
      temperature: todayVitals?.temperature || undefined,
      heartRate: todayVitals?.heartRate || undefined,
      systolicBP: todayVitals?.systolicBP || undefined,
      diastolicBP: todayVitals?.diastolicBP || undefined,
      respiratoryRate: todayVitals?.respiratoryRate || undefined,
      oxygenSaturation: todayVitals?.oxygenSaturation || undefined,
      bloodSugar: todayVitals?.bloodSugar || undefined,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Filtrer les valeurs vides
    const vitalSignsToSave: VitalSigns = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        vitalSignsToSave[key as keyof VitalSigns] = value;
      }
    });

    // Vérifier les valeurs impossibles
    const alerts = validateVitalSigns(vitalSignsToSave);
    if (alerts.length > 0) {
      toast({
        title: "Valeurs impossibles détectées",
        description: alerts.join("\n"),
        variant: "destructive",
      });
      return;
    }

    try {
      await saveVitalSigns.mutateAsync({
        patientId,
        date: selectedDate,
        vitalSigns: vitalSignsToSave,
      });
      toast({
        title: "Signes vitaux enregistrés",
        description: "Les constantes ont été sauvegardées pour ce jour.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les signes vitaux.",
        variant: "destructive",
      });
    }
  };

  const updateField = (field: keyof VitalSigns, value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mode édition
  if (isEditing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Signes vitaux du{" "}
              {format(new Date(selectedDate), "d MMMM", { locale: fr })}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Température */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                T°C
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="37.0"
                value={formData.temperature ?? ""}
                onChange={(e) => updateField("temperature", e.target.value)}
                className="h-9"
              />
            </div>

            {/* Pouls */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Pouls
              </Label>
              <Input
                type="number"
                placeholder="70"
                value={formData.heartRate ?? ""}
                onChange={(e) => updateField("heartRate", e.target.value)}
                className="h-9"
              />
            </div>

            {/* Tension */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label className="text-xs flex items-center gap-1">
                <Activity className="w-3 h-3" />
                TA (sys/dia)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.systolicBP ?? ""}
                  onChange={(e) => updateField("systolicBP", e.target.value)}
                  className="h-9 flex-1"
                />
                <span className="text-muted-foreground self-center">/</span>
                <Input
                  type="number"
                  placeholder="80"
                  value={formData.diastolicBP ?? ""}
                  onChange={(e) => updateField("diastolicBP", e.target.value)}
                  className="h-9 flex-1"
                />
              </div>
            </div>

            {/* FR */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Wind className="w-3 h-3" />
                FR
              </Label>
              <Input
                type="number"
                placeholder="16"
                value={formData.respiratoryRate ?? ""}
                onChange={(e) => updateField("respiratoryRate", e.target.value)}
                className="h-9"
              />
            </div>

            {/* SaO2 */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Wind className="w-3 h-3" />
                SaO₂%
              </Label>
              <Input
                type="number"
                placeholder="98"
                value={formData.oxygenSaturation ?? ""}
                onChange={(e) =>
                  updateField("oxygenSaturation", e.target.value)
                }
                className="h-9"
              />
            </div>

            {/* Glycémie */}
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Gly (g/L)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="1.0"
                value={formData.bloodSugar ?? ""}
                onChange={(e) => updateField("bloodSugar", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveVitalSigns.isPending}
            >
              {saveVitalSigns.isPending ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mode affichage
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Signes vitaux
            {hasVitalSigns && (
              <Badge variant="secondary" className="text-xs">
                {format(new Date(selectedDate), "d MMM", { locale: fr })}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit3 className="w-4 h-4 mr-2" />
            {hasVitalSigns ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {hasVitalSigns ? (
          <div className="flex flex-wrap gap-2">
            <VitalSignBadge
              icon={Thermometer}
              value={todayVitals?.temperature}
              unit="°C"
              label="Temp"
              colorClass="bg-orange-50 border-orange-200 text-orange-700"
            />
            <VitalSignBadge
              icon={Heart}
              value={todayVitals?.heartRate}
              unit="bpm"
              label="Pouls"
              colorClass="bg-red-50 border-red-200 text-red-700"
            />
            {(todayVitals?.systolicBP || todayVitals?.diastolicBP) && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-blue-50 border-blue-200 text-blue-700">
                <Activity className="w-4 h-4" />
                <div>
                  <span className="font-semibold">
                    {todayVitals?.systolicBP || "-"}/
                    {todayVitals?.diastolicBP || "-"}
                  </span>
                  <span className="text-xs ml-1">mmHg</span>
                </div>
              </div>
            )}
            <VitalSignBadge
              icon={Wind}
              value={todayVitals?.respiratoryRate}
              unit="rpm"
              label="FR"
              colorClass="bg-green-50 border-green-200 text-green-700"
            />
            <VitalSignBadge
              icon={Wind}
              value={todayVitals?.oxygenSaturation}
              unit="%"
              label="SaO₂"
              colorClass="bg-cyan-50 border-cyan-200 text-cyan-700"
            />
            <VitalSignBadge
              icon={Activity}
              value={todayVitals?.bloodSugar}
              unit="g/L"
              label="Gly"
              colorClass="bg-purple-50 border-purple-200 text-purple-700"
            />
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun signe vital enregistré pour ce jour</p>
            <p className="text-xs mt-1">
              Cliquez sur "Ajouter" pour les renseigner
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
