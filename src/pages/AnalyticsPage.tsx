import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsData } from "@/hooks/useAnalytics";
import { useAnnotationStats } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { Trash2, BarChart3, FileText, Users, Clock, TrendingUp, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, parseISO, subDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

export default function AnalyticsPage() {
  const { getStats, clearEvents } = useAnalyticsData();
  const stats = getStats();
  
  const { data: patients } = usePatients();
  const { data: annotationStats } = useAnnotationStats();

  const handleClear = () => {
    clearEvents();
    toast({
      title: "Données effacées",
      description: "Les statistiques de session ont été réinitialisées.",
    });
  };

  const recentAnnotations = annotationStats?.monthlyCount || 0;
  const totalAnnotations = annotationStats?.totalCount || 0;
  const totalPatients = patients?.length || 0;
  const timeSaved = annotationStats?.timeSavedMinutes || 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Aperçu de votre activité sur Medannot
          </p>
        </div>
        <Button variant="outline" onClick={handleClear} size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnotations}</div>
            <p className="text-xs text-muted-foreground">
              +{recentAnnotations} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Actuellement en suivi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps économisé</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(timeSaved / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {timeSaved % 60} minutes ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Copies batch</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.batchCopies}</div>
            <p className="text-xs text-muted-foreground">
              Mode soirée utilisé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Événements des dernières sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Annotations créées</span>
                <Badge variant="secondary">{stats.annotationsCreated}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Patients créés</span>
                <Badge variant="secondary">{stats.patientsCreated}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Templates utilisés</span>
                <Badge variant="secondary">{stats.templatesUsed}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total événements</span>
                <Badge variant="outline">{stats.totalEvents}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Productivité
            </CardTitle>
            <CardDescription>
              Estimation du temps économisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">
                  {Math.floor(timeSaved / 60)}h {timeSaved % 60}min
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Temps économisé ce mois
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Basé sur une estimation de <strong>15 minutes</strong> économisées par annotation 
                par rapport à une rédaction manuelle.
              </p>
              {annotationStats?.lastAnnotationDate && (
                <p className="text-sm">
                  <strong>Dernière annotation :</strong>{" "}
                  {format(parseISO(annotationStats.lastAnnotationDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Conseil pour optimiser votre flux</h3>
              <p className="text-muted-foreground mt-1">
                Utilisez le <strong>Mode Soirée</strong> pour copier toutes vos annotations du jour d'un coup. 
                Cela vous permet de tout transférer sur votre logiciel infirmier en quelques secondes seulement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
