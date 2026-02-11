import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Copy,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Activity,
  Thermometer,
  Heart,
  Wind,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn, cleanAnnotationForCopy } from "@/lib/utils";
import type { AnnotationWithPatient } from "@/hooks/useAnnotations";

// Type pour les signes vitaux
interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
}

// Extraire les tags/thèmes du contenu
function extractThemes(content: string): string[] {
  const themes = [];
  const lower = content.toLowerCase();
  
  if (lower.includes("médicament") || lower.includes("pilule") || lower.includes("injection")) {
    themes.push("Médication");
  }
  if (lower.includes("pansement") || lower.includes("plaie") || lower.includes("soin")) {
    themes.push("Soins");
  }
  if (lower.includes("tension") || lower.includes("pouls") || lower.includes("température")) {
    themes.push("Contrôle");
  }
  if (lower.includes("douleur") || lower.includes("mal") || lower.includes("inconfort")) {
    themes.push("Symptômes");
  }
  if (lower.includes("stable") || lower.includes("amélioration") || lower.includes("bon état")) {
    themes.push("Stable");
  }
  if (lower.includes("inquiétude") || lower.includes("à surveiller") || lower.includes("alerte")) {
    themes.push("À surveiller");
  }
  
  return themes.slice(0, 3); // Max 3 tags
}

// Extraire le résumé/contexte (première phrase significative)
function extractContext(content: string): string {
  // Enlever les balises markdown si présentes
  const clean = content.replace(/#{1,6}\s/g, "").replace(/\*\*/g, "");
  
  // Prendre la première phrase (jusqu'au point, ou 100 caractères)
  const firstSentence = clean.split(/[.!?]/)[0]?.trim() || "";
  
  if (firstSentence.length > 120) {
    return firstSentence.substring(0, 120) + "...";
  }
  return firstSentence;
}

// Détecter l'évolution (amélioration/détérioration)
function detectEvolution(content: string): "up" | "down" | "stable" | null {
  const lower = content.toLowerCase();
  
  if (lower.includes("amélioration") || lower.includes("mieux") || lower.includes("guérison")) {
    return "up";
  }
  if (lower.includes("aggravation") || lower.includes("moins bien") || lower.includes("détérioration")) {
    return "down";
  }
  if (lower.includes("stable") || lower.includes("inchangé")) {
    return "stable";
  }
  return null;
}

// Composant compact pour un signe vital - responsive
function VitalSignCompact({
  icon: Icon,
  value,
  unit,
  label,
  color
}: {
  icon: React.ElementType;
  value?: number;
  unit: string;
  label: string;
  color: string;
}) {
  if (value === undefined || value === null) return null;

  return (
    <div className={cn("flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium", color)}>
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
      <span className="font-semibold">{value}</span>
      <span className="opacity-60">{unit}</span>
    </div>
  );
}

interface AnnotationPreviewCardProps {
  annotation: AnnotationWithPatient;
  showPatient?: boolean;
  onView: (a: AnnotationWithPatient) => void;
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
}

export function AnnotationPreviewCard({
  annotation,
  showPatient = false,
  onView,
  onCopy,
  onDelete,
}: AnnotationPreviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const vitalSigns = annotation.vital_signs as VitalSigns;
  const hasVitals = vitalSigns && Object.keys(vitalSigns).length > 0;
  const themes = extractThemes(annotation.content);
  const evolution = detectEvolution(annotation.content);

  // Formater la date de façon plus lisible
  const visitDate = parseISO(annotation.visit_date || annotation.created_at);
  const isToday = new Date().toDateString() === visitDate.toDateString();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/60">
      <CardContent className="p-0">
        {/* Header épuré - responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-muted/20 to-transparent">
          {/* Info principale - Date | Heure | Patient sur une ligne */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
            {/* Date principale */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {isToday ? "Aujourd'hui" : format(visitDate, "d MMM yyyy", { locale: fr })}
              </span>
            </div>

            {/* Heure du RDV */}
            {annotation.visit_time && (
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50/80 border border-blue-200 rounded-lg shrink-0">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700" />
                <span className="text-xs sm:text-sm font-semibold text-blue-700">
                  {annotation.visit_time.slice(0, 5)}
                </span>
              </div>
            )}

            {/* Patient - PRIORITAIRE et bien visible */}
            {showPatient && annotation.patients && (
              <Link 
                to={`/app/patients/${annotation.patient_id || annotation.patientId}`}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg min-w-0 hover:bg-emerald-100 transition-all group shadow-sm"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-white">
                    {annotation.patients.first_name?.charAt(0).toUpperCase() || annotation.patients.last_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-900 truncate max-w-[100px] sm:max-w-[150px]">
                  {annotation.patients.last_name}
                </span>
                <span className="text-xs sm:text-sm font-medium text-emerald-700 truncate max-w-[80px] sm:max-w-[120px] hidden sm:inline">
                  {annotation.patients.first_name}
                </span>
                <ExternalLink className="w-3 h-3 text-emerald-500/60 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-0.5" />
              </Link>
            )}

            {/* Indicateur d'évolution - masqué sur très petit écran */}
            {evolution && (
              <div
                className={cn(
                  "hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
                  evolution === "up" && "bg-emerald-100 text-emerald-700",
                  evolution === "down" && "bg-rose-100 text-rose-700",
                  evolution === "stable" && "bg-sky-100 text-sky-700"
                )}
              >
                {evolution === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                {evolution === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                {evolution === "stable" && <Minus className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{evolution === "up" ? "En amélioration" : evolution === "down" ? "Attention requise" : "État stable"}</span>
              </div>
            )}
          </div>

          {/* Actions - mieux espacées sur mobile */}
          <div className="flex items-center gap-1 sm:gap-0.5 shrink-0 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(annotation.content)}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 hover:text-primary"
              title="Copier l'annotation"
            >
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(annotation)}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 hover:text-primary"
              title="Ouvrir en détail"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            {/* Bouton Modifier - redirige vers page d'édition */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-amber-100 hover:text-amber-600"
              title="Modifier l'annotation"
            >
              <Link to={`/app/annotations/${annotation.id}/edit`}>
                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(annotation.id)}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-destructive/10 hover:text-destructive"
              title="Supprimer l'annotation"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Contenu principal - padding responsive */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
          {/* Contenu de l'annotation */}
          <div className="space-y-2 sm:space-y-3">
            <p className={cn(
              "text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line",
              !expanded && "line-clamp-3"
            )}>
              {annotation.content}
            </p>

            {annotation.content.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-7 sm:h-8 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5 -ml-2"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                    Réduire
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                    Lire la suite
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Métadonnées complémentaires */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            {/* Durée de visite */}
            {annotation.visit_duration && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Durée : {annotation.visit_duration} min</span>
              </div>
            )}

            {/* Tags thématiques (max 2 pour éviter surcharge) */}
            {themes.slice(0, 2).map((theme, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[10px] sm:text-xs font-normal h-5 sm:h-6 px-1.5 sm:px-2"
              >
                {theme}
              </Badge>
            ))}
          </div>

          {/* Signes vitaux si présents - responsive */}
          {hasVitals && (
            <div className="pt-2 sm:pt-3 border-t border-dashed">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Signes vitaux
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <VitalSignCompact
                  icon={Thermometer}
                  value={vitalSigns.temperature}
                  unit="°C"
                  label="Temp"
                  color="bg-orange-50 text-orange-700 border border-orange-200"
                />
                <VitalSignCompact
                  icon={Heart}
                  value={vitalSigns.heartRate}
                  unit="bpm"
                  label="Pouls"
                  color="bg-rose-50 text-rose-700 border border-rose-200"
                />
                {(vitalSigns.systolicBP || vitalSigns.diastolicBP) && (
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                    <span className="font-semibold">
                      {vitalSigns.systolicBP || "-"}/{vitalSigns.diastolicBP || "-"}
                    </span>
                    <span className="opacity-70">mmHg</span>
                  </div>
                )}
                <VitalSignCompact
                  icon={Wind}
                  value={vitalSigns.oxygenSaturation}
                  unit="%"
                  label="SaO2"
                  color="bg-cyan-50 text-cyan-700 border border-cyan-200"
                />
                <VitalSignCompact
                  icon={Wind}
                  value={vitalSigns.respiratoryRate}
                  unit="/min"
                  label="FR"
                  color="bg-emerald-50 text-emerald-700 border border-emerald-200"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
