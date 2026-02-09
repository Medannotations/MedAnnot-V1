import { useState } from "react";
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

// Composant compact pour un signe vital
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
    <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-xs", color)}>
      <Icon className="w-3 h-3" />
      <span className="font-semibold">{value}</span>
      <span className="opacity-70">{unit}</span>
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
  const context = extractContext(annotation.content);
  const evolution = detectEvolution(annotation.content);
  
  // Formater la date de façon plus lisible
  const visitDate = parseISO(annotation.visit_date);
  const isToday = new Date().toDateString() === visitDate.toDateString();
  
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-0">
        {/* Header avec date et statut */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {isToday ? (
                <span className="text-primary font-semibold">Aujourd'hui</span>
              ) : (
                <span>{format(visitDate, "d MMM yyyy", { locale: fr })}</span>
              )}
            </div>
            
            {/* Heure */}
            {annotation.visit_time && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {annotation.visit_time.slice(0, 5)}
              </div>
            )}
            
            {/* Durée */}
            {annotation.visit_duration && (
              <Badge variant="secondary" className="text-xs h-5">
                {annotation.visit_duration} min
              </Badge>
            )}
            
            {/* Evolution */}
            {evolution && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs h-5 gap-1",
                  evolution === "up" && "border-green-300 text-green-700 bg-green-50",
                  evolution === "down" && "border-red-300 text-red-700 bg-red-50",
                  evolution === "stable" && "border-blue-300 text-blue-700 bg-blue-50"
                )}
              >
                {evolution === "up" && <TrendingUp className="w-3 h-3" />}
                {evolution === "down" && <TrendingDown className="w-3 h-3" />}
                {evolution === "stable" && <Minus className="w-3 h-3" />}
                {evolution === "up" ? "Amélioration" : evolution === "down" ? "À surveiller" : "Stable"}
              </Badge>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(annotation.content)}
              className="h-8 w-8"
              title="Copier"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(annotation)}
              className="h-8 w-8"
              title="Voir détails"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(annotation.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="p-4 space-y-3">
          {/* Patient (si affichage liste globale) */}
          {showPatient && (
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="w-4 h-4 text-muted-foreground" />
              {annotation.patients.last_name} {annotation.patients.first_name}
            </div>
          )}
          
          {/* Résumé clinique */}
          {context && (
            <div className="flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {context}
              </p>
            </div>
          )}
          
          {/* Tags thématiques */}
          {themes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {themes.map((theme, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className={cn(
                    "text-xs h-6",
                    theme === "Médication" && "border-amber-200 text-amber-700 bg-amber-50",
                    theme === "Soins" && "border-cyan-200 text-cyan-700 bg-cyan-50",
                    theme === "Contrôle" && "border-purple-200 text-purple-700 bg-purple-50",
                    theme === "Symptômes" && "border-orange-200 text-orange-700 bg-orange-50",
                    theme === "Stable" && "border-green-200 text-green-700 bg-green-50",
                    theme === "À surveiller" && "border-red-200 text-red-700 bg-red-50"
                  )}
                >
                  {theme === "Médication" && <Pill className="w-3 h-3 mr-1" />}
                  {theme === "Soins" && <Activity className="w-3 h-3 mr-1" />}
                  {theme === "Contrôle" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {theme === "Symptômes" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {theme === "Stable" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {theme === "À surveiller" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {theme}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Signes vitaux compacts */}
          {hasVitals && (
            <div className="flex flex-wrap gap-2 pt-1">
              <VitalSignCompact
                icon={Thermometer}
                value={vitalSigns.temperature}
                unit="°C"
                label="Temp"
                color="bg-orange-100 text-orange-700"
              />
              <VitalSignCompact
                icon={Heart}
                value={vitalSigns.heartRate}
                unit="bpm"
                label="Pouls"
                color="bg-red-100 text-red-700"
              />
              {(vitalSigns.systolicBP || vitalSigns.diastolicBP) && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                  <Activity className="w-3 h-3" />
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
                color="bg-cyan-100 text-cyan-700"
              />
              <VitalSignCompact
                icon={Wind}
                value={vitalSigns.respiratoryRate}
                unit="/min"
                label="FR"
                color="bg-green-100 text-green-700"
              />
            </div>
          )}
          
          {/* Aperçu du contenu */}
          <div className="pt-2 border-t">
            <p className={cn(
              "text-muted-foreground whitespace-pre-line text-sm",
              !expanded && "line-clamp-2"
            )}>
              {annotation.content}
            </p>
            
            {annotation.content.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                {expanded ? (
                  <><ChevronUp className="w-3 h-3 mr-1" /> Voir moins</>
                ) : (
                  <><ChevronDown className="w-3 h-3 mr-1" /> Voir plus</>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
