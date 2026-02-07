import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Clock,
  User,
  Copy,
  Eye,
  Pencil,
  Trash2,
  Filter,
  X,
  Moon,
  CheckSquare,
  Square,
  Download,
  ClipboardList,
  AlertCircle,
  Edit3,
  Trash,
} from "lucide-react";
import { useAnnotations, useDeleteAnnotation, type AnnotationWithPatient } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { useHasDraft, clearAnnotationDraft, getDraftSummary } from "@/hooks/usePersistedAnnotationState";
import { format, startOfMonth, endOfMonth, subMonths, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnotationViewModal } from "@/components/annotations/AnnotationViewModal";
import { Separator } from "@/components/ui/separator";

type PeriodFilter = "today" | "week" | "month" | "3months" | "custom" | "all";

const STEP_LABELS: Record<string, string> = {
  patient: "Sélection patient",
  visit: "Détails visite",
  record: "Enregistrement audio",
  transcription: "Transcription",
  result: "Annotation",
};

function getStepLabel(step: string): string {
  return STEP_LABELS[step] || step;
}

export default function AnnotationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewAnnotation, setViewAnnotation] = useState<AnnotationWithPatient | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mode "Soirée" - Batch actions
  const [batchMode, setBatchMode] = useState(false);
  const [selectedAnnotations, setSelectedAnnotations] = useState<Set<string>>(new Set());
  const [showBatchCopyDialog, setShowBatchCopyDialog] = useState(false);
  const [batchCopySeparator, setBatchCopySeparator] = useState("---");
  
  // Brouillon
  const hasDraft = useHasDraft();
  const [draftSummary, setDraftSummary] = useState<{ patientId: string | null; step: string; date: string } | null>(null);
  const [showDraftCard, setShowDraftCard] = useState(false);

  const { data: patients, isLoading: patientsLoading } = usePatients();
  
  // Charger le résumé du brouillon
  useEffect(() => {
    if (hasDraft) {
      setDraftSummary(getDraftSummary());
      setShowDraftCard(true);
    } else {
      setShowDraftCard(false);
    }
  }, [hasDraft]);
  const deleteAnnotation = useDeleteAnnotation();

  // Calculate date range based on period filter
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (periodFilter) {
      case "today":
        return {
          startDate: format(now, "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
      case "week":
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          startDate: format(weekAgo, "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
      case "month":
        return {
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      case "3months":
        return {
          startDate: format(subMonths(now, 3), "yyyy-MM-dd"),
          endDate: format(now, "yyyy-MM-dd"),
        };
      case "custom":
        return {
          startDate: customStartDate || undefined,
          endDate: customEndDate || undefined,
        };
      default:
        return {};
    }
  }, [periodFilter, customStartDate, customEndDate]);

  const { data: annotations, isLoading: annotationsLoading } = useAnnotations({
    patientId: patientFilter !== "all" ? patientFilter : undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    searchQuery: searchQuery || undefined,
  });

  // Filtrer pour n'afficher que les annotations d'aujourd'hui en mode batch par défaut
  const todayAnnotations = useMemo(() => {
    if (!annotations) return [];
    return annotations.filter(a => isToday(parseISO(a.visit_date)));
  }, [annotations]);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "✓ Copié !",
      description: "L'annotation a été copiée dans le presse-papier.",
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAnnotation.mutateAsync(deleteId);
      toast({
        title: "Annotation supprimée",
        description: "L'annotation a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annotation.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setPatientFilter("all");
    setPeriodFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    patientFilter !== "all" ||
    periodFilter !== "all" ||
    searchQuery.length > 0;

  const isLoading = annotationsLoading || patientsLoading;

  // Mode Batch functions
  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    setSelectedAnnotations(new Set());
  };

  const toggleAnnotationSelection = (id: string) => {
    const newSelected = new Set(selectedAnnotations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAnnotations(newSelected);
  };

  const selectAllToday = () => {
    if (!todayAnnotations) return;
    const allIds = new Set(todayAnnotations.map(a => a.id));
    setSelectedAnnotations(allIds);
  };

  const clearSelection = () => {
    setSelectedAnnotations(new Set());
  };

  const handleBatchCopy = async () => {
    if (!annotations) return;
    
    const selectedData = annotations.filter(a => selectedAnnotations.has(a.id));
    // Trier par date de visite
    selectedData.sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime());
    
    const combined = selectedData.map(a => {
      const patientName = `${a.patients.last_name} ${a.patients.first_name}`;
      const date = format(parseISO(a.visit_date), "d MMMM yyyy", { locale: fr });
      const time = a.visit_time ? ` à ${a.visit_time.slice(0, 5)}` : "";
      return `**${patientName}** - ${date}${time}\n\n${a.content}`;
    }).join(`\n\n${batchCopySeparator}\n\n`);

    await navigator.clipboard.writeText(combined);
    
    toast({
      title: "✓ Annotations copiées !",
      description: `${selectedData.length} annotation(s) copiées dans le presse-papier.`,
    });
    
    setShowBatchCopyDialog(false);
    setBatchMode(false);
    setSelectedAnnotations(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Annotations</h1>
          <p className="text-muted-foreground mt-1">
            Gérez toutes vos annotations infirmières
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={batchMode ? "secondary" : "outline"} 
            onClick={toggleBatchMode}
            size="sm"
          >
            <Moon className="w-4 h-4 mr-2" />
            {batchMode ? "Quitter mode Soirée" : "Mode Soirée"}
          </Button>
          <Button asChild size="lg">
            <Link to="/app/annotations/new">
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle annotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Brouillon en cours */}
      {showDraftCard && draftSummary && (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Brouillon en cours</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous avez une annotation non terminée du {draftSummary.date} 
                    {draftSummary.step && ` (étape: ${getStepLabel(draftSummary.step)})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    clearAnnotationDraft();
                    setShowDraftCard(false);
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
                <Button 
                  asChild
                  size="sm" 
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Link to="/app/annotations/new">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Continuer
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode Soirée Banner */}
      {batchMode && (
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mode Soirée</h3>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez les annotations à copier en une seule fois
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {todayAnnotations.length > 0 && (
                  <Button variant="outline" size="sm" onClick={selectAllToday}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Tout le jour
                  </Button>
                )}
                {selectedAnnotations.size > 0 && (
                  <>
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <Square className="w-4 h-4 mr-2" />
                      Désélectionner
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setShowBatchCopyDialog(true)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Copier {selectedAnnotations.size} annotation{selectedAnnotations.size > 1 ? "s" : ""}
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {selectedAnnotations.size > 0 && (
              <div className="mt-4 pt-4 border-t border-indigo-200/50">
                <p className="text-sm text-muted-foreground">
                  {selectedAnnotations.size} annotation{selectedAnnotations.size > 1 ? "s" : ""} sélectionnée{selectedAnnotations.size > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les annotations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {[patientFilter !== "all", periodFilter !== "all", searchQuery.length > 0].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
          <Badge variant="outline" className="text-muted-foreground">
            <FileText className="w-3 h-3 mr-1" />
            {annotations?.length || 0} annotation{(annotations?.length || 0) > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Patient Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient
                </label>
                <Select value={patientFilter} onValueChange={setPatientFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les patients</SelectItem>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.last_name} {patient.first_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Période
                </label>
                <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les dates</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois-ci</SelectItem>
                    <SelectItem value="3months">3 derniers mois</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {periodFilter === "custom" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Du</label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Au</label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : annotations?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {hasActiveFilters ? (
              <>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune annotation ne correspond</p>
                <p className="text-sm mb-4">Modifiez vos critères de recherche</p>
                <Button variant="outline" onClick={clearFilters}>
                  Réinitialiser les filtres
                </Button>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune annotation pour le moment</p>
                <p className="text-sm mb-4">
                  Créez votre première annotation pour documenter vos visites
                </p>
                <Button asChild>
                  <Link to="/app/annotations/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer ma première annotation
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {annotations?.map((annotation) => (
            <Card 
              key={annotation.id} 
              className={`hover:shadow-md transition-shadow ${
                batchMode && selectedAnnotations.has(annotation.id) 
                  ? "ring-2 ring-indigo-500 border-indigo-500" 
                  : ""
              }`}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {batchMode && (
                      <Checkbox 
                        checked={selectedAnnotations.has(annotation.id)}
                        onCheckedChange={() => toggleAnnotationSelection(annotation.id)}
                        className="mt-1"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-lg">
                          {annotation.patients.last_name} {annotation.patients.first_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(parseISO(annotation.visit_date), "EEEE d MMMM yyyy", { locale: fr })}
                        </span>
                        {annotation.visit_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {annotation.visit_time.slice(0, 5)}
                          </span>
                        )}
                        {annotation.visit_duration && (
                          <Badge variant="outline">{annotation.visit_duration} min</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {!batchMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(annotation.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Content Preview */}
                <p className="text-muted-foreground line-clamp-3 whitespace-pre-line mb-4">
                  {annotation.content.substring(0, 300)}
                  {annotation.content.length > 300 && "..."}
                </p>

                {/* Actions */}
                {!batchMode && (
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAnnotation(annotation)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/app/annotations/${annotation.id}/edit`}>
                        <Pencil className="w-4 h-4 mr-1" />
                        Éditer
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive ml-auto"
                      onClick={() => setDeleteId(annotation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annotation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'annotation sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Modal */}
      {viewAnnotation && (
        <AnnotationViewModal
          annotation={viewAnnotation}
          isOpen={!!viewAnnotation}
          onClose={() => setViewAnnotation(null)}
          onCopy={() => handleCopy(viewAnnotation.content)}
        />
      )}

      {/* Batch Copy Dialog */}
      <Dialog open={showBatchCopyDialog} onOpenChange={setShowBatchCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Copier les annotations
            </DialogTitle>
            <DialogDescription>
              {selectedAnnotations.size} annotation{selectedAnnotations.size > 1 ? "s" : ""} seront copiées dans le presse-papier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Séparateur entre les annotations</Label>
              <Select value={batchCopySeparator} onValueChange={setBatchCopySeparator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="---">Ligne de tirets (---)</SelectItem>
                  <SelectItem value="\n\n">Double saut de ligne</SelectItem>
                  <SelectItem value="\n==========\n">Ligne d'égal (=)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Aperçu du format :</p>
              <p className="text-muted-foreground">
                <strong>Nom Patient</strong> - Date<br/>
                Contenu de l'annotation...<br/><br/>
                {batchCopySeparator === "\n\n" ? "(saut de ligne)" : 
                 batchCopySeparator === "\n==========\n" ? "==========" : 
                 batchCopySeparator}<br/><br/>
                <strong>Nom Patient 2</strong> - Date<br/>
                Contenu de l'annotation...
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchCopyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleBatchCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copier tout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
