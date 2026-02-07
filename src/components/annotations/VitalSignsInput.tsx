import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Activity, Thermometer, Heart, Wind, Scale, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VitalSigns {
  temperature?: number; // °C
  heartRate?: number; // bpm
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  respiratoryRate?: number; // rpm
  oxygenSaturation?: number; // %
  weight?: number; // kg
  height?: number; // cm
  bloodSugar?: number; // g/L
  painLevel?: number; // 0-10
  consciousness?: "alert" | "verbal" | "pain" | "unresponsive";
}

interface VitalSignsInputProps {
  value: VitalSigns;
  onChange: (signs: VitalSigns) => void;
  className?: string;
}

const CONSCIOUSNESS_LEVELS = [
  { value: "alert", label: "Alerte", color: "text-green-600" },
  { value: "verbal", label: "Réponse verbale", color: "text-yellow-600" },
  { value: "pain", label: "Réponse à la douleur", color: "text-orange-600" },
  { value: "unresponsive", label: "Non réactif", color: "text-red-600" },
] as const;

export function VitalSignsInput({ value, onChange, className }: VitalSignsInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasAnyValue = Object.values(value).some(v => v !== undefined && v !== "");

  const updateSign = (key: keyof VitalSigns, val: number | string | undefined) => {
    onChange({ ...value, [key]: val });
  };

  const getBPCategory = (sys?: number, dia?: number) => {
    if (!sys || !dia) return null;
    if (sys < 120 && dia < 80) return { label: "Normale", color: "text-green-600" };
    if (sys < 130 && dia < 80) return { label: "Élevée", color: "text-yellow-600" };
    if (sys < 140 || dia < 90) return { label: "HTA Stade 1", color: "text-orange-600" };
    return { label: "HTA Stade 2", color: "text-red-600" };
  };

  const getTempCategory = (temp?: number) => {
    if (!temp) return null;
    if (temp < 36) return { label: "Hypothermie", color: "text-blue-600" };
    if (temp <= 37.5) return { label: "Normale", color: "text-green-600" };
    if (temp <= 38.5) return { label: "Fièvre modérée", color: "text-orange-600" };
    return { label: "Fièvre élevée", color: "text-red-600" };
  };

  const bpCategory = getBPCategory(value.systolicBP, value.diastolicBP);
  const tempCategory = getTempCategory(value.temperature);

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
            {tempCategory && (
              <span className={cn("text-sm font-medium", tempCategory.color)}>
                {tempCategory.label}
              </span>
            )}
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
            {bpCategory && (
              <span className={cn("text-sm font-medium ml-2", bpCategory.color)}>
                {bpCategory.label}
              </span>
            )}
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

        {/* Douleur */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Échelle de douleur (0-10)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="range"
              min="0"
              max="10"
              value={value.painLevel || 0}
              onChange={(e) => updateSign("painLevel", parseInt(e.target.value))}
              className="w-48"
            />
            <span className={cn(
              "font-bold w-8 text-center",
              (value.painLevel || 0) <= 3 ? "text-green-600" :
              (value.painLevel || 0) <= 6 ? "text-yellow-600" : "text-red-600"
            )}>
              {value.painLevel || 0}
            </span>
          </div>
        </div>

        {/* État de conscience */}
        <div className="space-y-2">
          <Label>État de conscience</Label>
          <div className="grid grid-cols-2 gap-2">
            {CONSCIOUSNESS_LEVELS.map((level) => (
              <Button
                key={level.value}
                type="button"
                variant={value.consciousness === level.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateSign("consciousness", level.value)}
                className={cn(value.consciousness === level.value && level.color)}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Poids et taille */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Poids (kg)
            </Label>
            <Input
              type="number"
              step="0.1"
              placeholder="70.0"
              value={value.weight || ""}
              onChange={(e) => updateSign("weight", e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Taille (cm)
            </Label>
            <Input
              type="number"
              placeholder="170"
              value={value.height || ""}
              onChange={(e) => updateSign("height", e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>
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
  if (signs.painLevel !== undefined) parts.push(`Douleur ${signs.painLevel}/10`);
  if (signs.consciousness) {
    const labels: Record<string, string> = {
      alert: "Alerte",
      verbal: "Réponse verbale",
      pain: "Réponse à la douleur",
      unresponsive: "Non réactif"
    };
    parts.push(`Conscience: ${labels[signs.consciousness]}`);
  }
  if (signs.weight) parts.push(`Poids ${signs.weight} kg`);
  if (signs.height) parts.push(`Taille ${signs.height} cm`);
  
  return parts.join(" | ");
}
