import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnnotationStats, useAnnotations } from "@/hooks/useAnnotations";
import { usePatients } from "@/hooks/usePatients";
import { BarChart3, FileText, Users, Clock, TrendingUp, Activity, Calendar } from "lucide-react";
import { format, parseISO, subDays, isAfter, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

export default function AnalyticsPage() {
  const { data: patients } = usePatients();
  const { data: annotationStats } = useAnnotationStats();
  const { data: annotations } = useAnnotations();

  // Calculs basés sur les vraies données
  const totalAnnotations = annotations?.length || 0;
  const totalPatients = patients?.length || 0;
  
  // Annotations du mois en cours
  const startOfCurrentMonth = startOfMonth(new Date());
  const monthlyAnnotations = annotations?.filter(a => 
    isAfter(new Date(a.created_at), startOfCurrentMonth)
  ).length || 0;
  
  // Patients créés récemment (7 derniers jours)
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentPatients = patients?.filter(p => 
    isAfter(new Date(p.created_at), sevenDaysAgo)
  ).length || 0;
  
  // Annotations récentes (7 derniers jours)
  const recentAnnotations = annotations?.filter(a => 
    isAfter(new Date(a.created_at), sevenDaysAgo)
  ).length || 0;

  // Temps économisé : estimation de 10 min par annotation (plus réaliste)
  const timeSavedMinutes = totalAnnotations * 10;
  const timeSavedHours = Math.floor(timeSavedMinutes / 60);

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
              +{monthlyAnnotations} ce mois
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
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Annotations (7 jours)
                </span>
                <Badge variant="secondary">+{recentAnnotations}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Patients ajoutés (7 jours)
                </span>
                <Badge variant="secondary">+{recentPatients}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ce mois
                </span>
                <Badge variant="outline">{monthlyAnnotations} annotations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Temps estimé économisé
                </span>
                <Badge variant="outline">{timeSavedHours}h</Badge>
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
                  {timeSavedHours}h {timeSavedMinutes % 60}min
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Temps économisé au total
                </p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  💡 <strong>En moyenne</strong>, une annotation prend :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>12-15 min</strong> en rédaction manuelle</li>
                  <li><strong>2-3 min</strong> avec Medannot</li>
                  <li><strong>~10 min économisées</strong> par annotation</li>
                </ul>
              </div>
              {annotations && annotations.length > 0 && (
                <p className="text-sm">
                  <strong>Dernière annotation :</strong>{" "}
                  {format(parseISO(annotations[0].created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
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
