import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Activity, Thermometer, Heart, Wind, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VitalSigns {
  temperature?: number; // °C
  heartRate?: number; // bpm
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  respiratoryRate?: number; // rpm
  oxygenSaturation?: number; // %
  bloodSugar?: number; // g/L
}

interface VitalSignsInputProps {
  value: VitalSigns;
  onChange: (signs: VitalSigns) => void;
  className?: string;
}



// Fonction de validation des signes vitaux - VALEURS IMPOSSIBLES SEULEMENT
export function validateVitalSigns(signs: VitalSigns): { isValid: boolean; alerts: string[] } {
  const alerts: string[] = [];
  
  // Vérification des valeurs IMPOSSIBLES (pas anormales, mais irrationnelles)
  if (signs.temperature !== undefined) {
    if (signs.temperature < 20 || signs.temperature > 45) {
      alerts.push(`🌡️ Température impossible (${signs.temperature}°C)`);
    }
  }
  
  if (signs.heartRate !== undefined) {
    if (signs.heartRate < 20 || signs.heartRate > 250) {
      alerts.push(`❤️ Fréquence cardiaque impossible (${signs.heartRate} bpm)`);
    }
  }
  
  if (signs.systolicBP !== undefined) {
    if (signs.systolicBP < 40 || signs.systolicBP > 300) {
      alerts.push(`🩸 Tension systolique impossible (${signs.systolicBP} mmHg)`);
    }
  }
  
  if (signs.diastolicBP !== undefined) {
    if (signs.diastolicBP < 20 || signs.diastolicBP > 200) {
      alerts.push(`🩸 Tension diastolique impossible (${signs.diastolicBP} mmHg)`);
    }
  }
  
  if (signs.respiratoryRate !== undefined) {
    if (signs.respiratoryRate < 4 || signs.respiratoryRate > 60) {
      alerts.push(`🫁 Fréquence respiratoire impossible (${signs.respiratoryRate} rpm)`);
    }
  }
  
  if (signs.oxygenSaturation !== undefined) {
    if (signs.oxygenSaturation < 30 || signs.oxygenSaturation > 100) {
      alerts.push(`🫁 Saturation O₂ impossible (${signs.oxygenSaturation}%)`);
    }
  }
  
  if (signs.bloodSugar !== undefined) {
    if (signs.bloodSugar < 0.1 || signs.bloodSugar > 10) {
      alerts.push(`🍯 Glycémie impossible (${signs.bloodSugar} g/L)`);
    }
  }
  
  return { isValid: alerts.length === 0, alerts };
}

export function VitalSignsInput({ value, onChange, className }: VitalSignsInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasAnyValue = Object.values(value).some(v => v !== undefined && v !== "");

  const updateSign = (key: keyof VitalSigns, val: number | string | undefined) => {
    onChange({ ...value, [key]: val });
  };

  // Pas de catégories de couleur - on ne notifie que les valeurs impossibles

  if (!isExpanded) {
    return (
      <Card className={cn("border-dashed cursor-pointer hover:border-primary/50 transition-colors", className)}>
        <CardContent className="p-4" onClick={() => setIsExpanded(true)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Signes vitaux</h4>
                <p className="text-sm text-muted-foreground">
                  {hasAnyValue 
                    ? `${value.temperature ? `T° ${value.temperature}°C` : ""} ${value.heartRate ? `Pouls ${value.heartRate}bpm` : ""}...`.trim() || "Renseignés"
                    : "Cliquer pour ajouter les constantes"
                  }
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              {hasAnyValue ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Signes vitaux
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Réduire
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Température */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Température (°C)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              step="0.1"
              placeholder="37.0"
              value={value.temperature || ""}
              onChange={(e) => updateSign("temperature", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-32"
            />

          </div>
        </div>

        {/* Pouls */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Pouls (bpm)
          </Label>
          <Input
            type="number"
            placeholder="70"
            value={value.heartRate || ""}
            onChange={(e) => updateSign("heartRate", e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-32"
          />
        </div>

        {/* Tension artérielle */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Tension artérielle (mmHg)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="120"
              value={value.systolicBP || ""}
              onChange={(e) => updateSign("systolicBP", e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24"
            />
            <span className="text-muted-foreground">/</span>
            <Input
              type="number"
              placeholder="80"
              value={value.diastolicBP || ""}
              onChange={(e) => updateSign("diastolicBP", e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24"
            />

          </div>
        </div>

        {/* Fréquence respiratoire */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Fréquence respiratoire (rpm)
          </Label>
          <Input
            type="number"
            placeholder="16"
            value={value.respiratoryRate || ""}
            onChange={(e) => updateSign("respiratoryRate", e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-32"
          />
        </div>

        {/* Saturation O2 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Saturation O₂ (%)
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="98"
            value={value.oxygenSaturation || ""}
            onChange={(e) => updateSign("oxygenSaturation", e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-32"
          />
        </div>

        {/* Glycémie */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Glycémie (g/L)
          </Label>
          <Input
            type="number"
            step="0.1"
            placeholder="1.0"
            value={value.bloodSugar || ""}
            onChange={(e) => updateSign("bloodSugar", e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-32"
          />
        </div>



        {/* Alertes si valeurs anormales */}
        {(() => {
          const { alerts } = validateVitalSigns(value);
          if (alerts.length === 0) return null;
          return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">⚠️ Valeurs vitales anormales détectées</p>
                  <ul className="mt-2 space-y-1">
                    {alerts.map((alert, idx) => (
                      <li key={idx} className="text-sm text-red-700">{alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}

// Fonction utilitaire pour formater les signes vitaux dans le texte
export function formatVitalSigns(signs: VitalSigns): string {
  const parts: string[] [] = [];
  
  if (signs.temperature) parts.push(`T° ${signs.temperature}°C`);
  if (signs.heartRate) parts.push(`Pouls ${signs.heartRate} bpm`);
  if (signs.systolicBP && signs.diastolicBP) {
    parts.push(`TA ${signs.systolicBP}/${signs.diastolicBP} mmHg`);
  }
  if (signs.respiratoryRate) parts.push(`FR ${signs.respiratoryRate} rpm`);
  if (signs.oxygenSaturation) parts.push(`SaO₂ ${signs.oxygenSaturation}%`);
  if (signs.bloodSugar) parts.push(`Glycémie ${signs.bloodSugar} g/L`);

  
  return parts.join(" | ");
}
