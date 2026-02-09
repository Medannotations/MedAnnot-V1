import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  X,
  Activity,
  Heart,
  Wind,
  Thermometer,
  AlertCircle,
} from "lucide-react";
import { useAnnotations, useDeleteAnnotation, type AnnotationWithPatient } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { format, isToday, parseISO, subDays, subWeeks, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnotationViewModal } from "@/components/annotations/AnnotationViewModal";
import { AnnotationPreviewCard } from "@/components/annotations/AnnotationPreviewCard";
import { cn, cleanAnnotationForCopy } from "@/lib/utils";

// Type pour les signes vitaux
interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  painLevel?: number;
  consciousness?: string;
}

// Composant pour afficher les signes vitaux
function VitalSignsBadge({ signs }: { signs: VitalSigns | null | undefined }) {
  if (!signs) return null;
  
  const hasAnySign = Object.values(signs).some(v => v !== undefined && v !== null && v !== "");
  if (!hasAnySign) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {signs.temperature && (
        <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
          <Thermometer className="w-3 h-3 mr-1" />
          {signs.temperature}°C
        </Badge>
      )}
      {signs.heartRate && (
        <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
          <Heart className="w-3 h-3 mr-1" />
          {signs.heartRate} bpm
        </Badge>
      )}
      {(signs.systolicBP || signs.diastolicBP) && (
        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
          <Activity className="w-3 h-3 mr-1" />
          {signs.systolicBP}/{signs.diastolicBP}
        </Badge>
      )}
      {signs.oxygenSaturation && (
        <Badge variant="outline" className="text-xs bg-cyan-50 border-cyan-200 text-cyan-700">
          <Wind className="w-3 h-3 mr-1" />
          {signs.oxygenSaturation}%
        </Badge>
      )}
      {signs.respiratoryRate && (
        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
          {signs.respiratoryRate} rpm
        </Badge>
      )}
      {signs.painLevel !== undefined && signs.painLevel > 0 && (
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs",
            signs.painLevel >= 7 ? "bg-red-50 border-red-300 text-red-700" :
            signs.painLevel >= 4 ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
            "bg-green-50 border-green-200 text-green-700"
          )}
        >
          Douleur: {signs.painLevel}/10
        </Badge>
      )}
      {signs.consciousness && signs.consciousness !== "alert" && (
        <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
          ⚠️ {signs.consciousness === "unresponsive" ? "Inconscient" : 
               signs.consciousness === "pain" ? "Réponse douleur" : 
               signs.consciousness === "verbal" ? "Réponse verbale" : signs.consciousness}
        </Badge>
      )}
    </div>
  );
}



export default function AnnotationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewAnnotation, setViewAnnotation] = useState<AnnotationWithPatient | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { data: annotations, isLoading: annotationsLoading } = useAnnotations();
  const deleteAnnotation = useDeleteAnnotation();

  const isLoading = annotationsLoading || patientsLoading;

  // Filtrer les annotations
  const filteredAnnotations = useMemo(() => {
    if (!annotations) return [];
    
    return annotations.filter((annotation) => {
      // Filtre recherche texte
      const matchesSearch = !searchQuery || 
        annotation.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        annotation.patients.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        annotation.patients.last_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre patient
      const matchesPatient = patientFilter === "all" || annotation.patient_id === patientFilter;
      
      // Filtre date
      let matchesDate = true;
      const annotationDate = parseISO(annotation.visit_date);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = isToday(annotationDate);
          break;
        case "yesterday":
          matchesDate = annotationDate >= subDays(now, 1) && annotationDate < now;
          break;
        case "week":
          matchesDate = annotationDate >= subWeeks(now, 1);
          break;
        case "month":
          matchesDate = annotationDate >= subMonths(now, 1);
          break;
        case "3months":
          matchesDate = annotationDate >= subMonths(now, 3);
          break;
      }
      
      return matchesSearch && matchesPatient && matchesDate;
    }).sort((a, b) => 
      new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
    );
  }, [annotations, searchQuery, patientFilter, dateFilter]);

  // Annotations du jour
  const todayAnnotations = useMemo(() => {
    return filteredAnnotations.filter(a => isToday(parseISO(a.visit_date)));
  }, [filteredAnnotations]);

  // Annotations historique (pas aujourd'hui)
  const historyAnnotations = useMemo(() => {
    return filteredAnnotations.filter(a => !isToday(parseISO(a.visit_date)));
  }, [filteredAnnotations]);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(cleanAnnotationForCopy(content));
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
    setSearchQuery("");
    setPatientFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters = searchQuery || patientFilter !== "all" || dateFilter !== "all";

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Mes Annotations</h1>
            <p className="text-muted-foreground mt-1">Chargement...</p>
          </div>
        </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mes Annotations</h1>
          <p className="text-muted-foreground mt-1">
            {annotations?.length || 0} annotation{annotations?.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/app/annotations/new">
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle annotation
          </Link>
        </Button>
      </div>

      {/* Filtres */}
      <div className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les annotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {[searchQuery, patientFilter !== "all", dateFilter !== "all"].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Filtre patient */}
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

                {/* Filtre date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Période
                  </label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="yesterday">Hier</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="3months">3 derniers mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="mt-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Résumé des filtres actifs */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                <Search className="w-3 h-3" />
                "{searchQuery}"
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {patientFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <User className="w-3 h-3" />
                {patients?.find(p => p.id === patientFilter)?.last_name}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPatientFilter("all")} />
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="w-3 h-3" />
                {dateFilter === "today" ? "Aujourd'hui" :
                 dateFilter === "yesterday" ? "Hier" :
                 dateFilter === "week" ? "Cette semaine" :
                 dateFilter === "month" ? "Ce mois" : "3 mois"}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setDateFilter("all")} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="w-4 h-4" />
            Aujourd'hui
            {todayAnnotations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {todayAnnotations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileText className="w-4 h-4" />
            Historique
            {historyAnnotations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {historyAnnotations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab Aujourd'hui */}
        <TabsContent value="today" className="mt-6 space-y-4">
          {todayAnnotations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune annotation aujourd'hui</p>
                <p className="text-sm mb-4">Créez votre première annotation de la journée</p>
                <Button asChild>
                  <Link to="/app/annotations/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle annotation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todayAnnotations.map((annotation) => (
                <AnnotationPreviewCard
                  key={annotation.id}
                  annotation={annotation}
                  showPatient={true}
                  onView={setViewAnnotation}
                  onCopy={handleCopy}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab Historique */}
        <TabsContent value="history" className="mt-6 space-y-4">
          {historyAnnotations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune annotation dans l'historique</p>
                <p className="text-sm">
                  {hasActiveFilters 
                    ? "Modifiez vos filtres pour voir plus de résultats" 
                    : "Les annotations passées apparaîtront ici"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Réinitialiser les filtres
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyAnnotations.map((annotation) => (
                <AnnotationPreviewCard
                  key={annotation.id}
                  annotation={annotation}
                  showPatient={true}
                  onView={setViewAnnotation}
                  onCopy={handleCopy}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
