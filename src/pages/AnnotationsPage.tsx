import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useAnnotations, useDeleteAnnotation, type AnnotationWithPatient } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnotationViewModal } from "@/components/annotations/AnnotationViewModal";

type PeriodFilter = "today" | "week" | "month" | "3months" | "custom" | "all";

export default function AnnotationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewAnnotation, setViewAnnotation] = useState<AnnotationWithPatient | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: patients, isLoading: patientsLoading } = usePatients();
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
        <Button asChild size="lg">
          <Link to="/app/annotations/new">
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle annotation
          </Link>
        </Button>
      </div>

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
        <div className="flex items-center gap-2">
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
            <Card key={annotation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
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
                        {format(new Date(annotation.visit_date), "EEEE d MMMM yyyy", { locale: fr })}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(annotation.content)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content Preview */}
                <p className="text-muted-foreground line-clamp-3 whitespace-pre-line mb-4">
                  {annotation.content.substring(0, 300)}
                  {annotation.content.length > 300 && "..."}
                </p>

                {/* Actions */}
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
    </div>
  );
}
