import { useMemo } from "react";
import { FileText, Users, Mic, TrendingUp, Clock, Calendar, Plus, ArrowRight, CheckCircle, Activity, Lightbulb, Settings, Sparkles, MessageSquare, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { usePatients } from "@/hooks/usePatients";
import { useAnnotations } from "@/hooks/useAnnotations";
import { useUserConfiguration, useExampleAnnotations } from "@/hooks/useConfiguration";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, isWithinInterval, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: patients = [] } = usePatients(true);
  const { data: annotations = [] } = useAnnotations();
  const { data: config } = useUserConfiguration();
  const { data: examples = [] } = useExampleAnnotations();

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const activePatients = patients.filter(p => !p.is_archived).length;
    const archivedPatients = patients.filter(p => p.is_archived).length;

    const annotationsThisMonth = annotations.filter(a => {
      const date = new Date(a.created_at);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    }).length;

    // Estimate time saved (assume 15 min saved per annotation vs manual writing)
    const timeSavedMinutes = annotations.length * 15;
    const timeSavedHours = Math.floor(timeSavedMinutes / 60);
    const timeSavedDisplay = timeSavedHours > 0 
      ? `${timeSavedHours}h${timeSavedMinutes % 60 > 0 ? ` ${timeSavedMinutes % 60}min` : ''}`
      : `${timeSavedMinutes}min`;

    // Last annotation
    const lastAnnotation = annotations.length > 0 
      ? annotations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      : null;

    return {
      activePatients,
      archivedPatients,
      totalPatients: patients.length,
      annotationsThisMonth,
      totalAnnotations: annotations.length,
      timeSavedDisplay,
      lastAnnotation,
    };
  }, [patients, annotations]);

  // Onboarding progress
  const onboardingSteps = useMemo(() => [
    {
      label: "Définir votre structure d'annotation",
      description: "Choisissez comment l'IA doit organiser vos annotations : par sections (motif, observations, soins...) ou chronologiquement. Plusieurs modèles sont proposés.",
      completed: !!config?.annotation_structure && config.annotation_structure.length > 50 && !config.annotation_structure.startsWith('Motif et contexte de la visite'),
      href: "/app/configuration?tab=structure",
      icon: Settings,
    },
    {
      label: "Créer votre premier patient",
      description: "Ajoutez un patient avec ses pathologies, tags et informations clés. L'IA les utilisera pour contextualiser chaque annotation automatiquement.",
      completed: patients.length > 0,
      href: "/app/patients",
      icon: Users,
    },
    {
      label: "Ajouter des exemples par patient",
      description: "Dans le dossier de chaque patient, ajoutez des exemples d'annotations passées. L'IA apprendra votre style de rédaction spécifique à ce patient pour des résultats encore plus personnalisés.",
      completed: patients.some(p => (p.exampleAnnotations?.length || 0) > 0),
      href: patients.length > 0 ? `/app/patients/${patients[0].id}` : "/app/patients",
      icon: Lightbulb,
    },
    {
      label: "Créer votre première annotation",
      description: "Dictez vos observations vocalement après une visite. L'IA génère une annotation professionnelle structurée en quelques secondes.",
      completed: annotations.length > 0,
      href: "/app/annotations/new",
      icon: Mic,
    },
  ], [config, examples, patients, annotations]);

  const completedSteps = onboardingSteps.filter(s => s.completed).length;
  const onboardingProgress = (completedSteps / onboardingSteps.length) * 100;
  const isOnboardingComplete = completedSteps === onboardingSteps.length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Bonjour{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre activité sur Medannot
          </p>
        </div>
        <Button asChild size="lg" className="w-full md:w-auto">
          <Link to="/app/annotations/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle annotation
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.archivedPatients > 0 && `+ ${stats.archivedPatients} archivés`}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.annotationsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              annotations créées
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps économisé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSavedDisplay}</div>
            <p className="text-xs text-muted-foreground">
              estimé au total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière activité</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastAnnotation 
                ? formatDistanceToNow(new Date(stats.lastAnnotation.created_at), { addSuffix: true, locale: fr })
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              dernière annotation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Onboarding Progress */}
        {!isOnboardingComplete && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                Guide de démarrage
              </CardTitle>
              <CardDescription>
                Préparez votre compte en quelques minutes pour obtenir les meilleures annotations possibles.
                Plus votre configuration est complète, plus l'IA sera précise et adaptée à votre pratique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{completedSteps}/{onboardingSteps.length} étapes</span>
                </div>
                <Progress value={onboardingProgress} className="h-2" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {onboardingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <Link
                      key={index}
                      to={step.href}
                      className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
                        step.completed
                          ? "border-secondary/30 bg-secondary/5"
                          : "border-border hover:border-primary/30 hover:bg-accent hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          step.completed
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`font-medium text-sm ${step.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {!step.completed && (
                        <span className="text-xs text-primary font-medium flex items-center gap-1 mt-auto">
                          Configurer
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Tips section */}
              <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Astuce : les signes vitaux
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sur la fiche de chaque patient, vous pouvez enregistrer les signes vitaux (tension, pouls, température, saturation, glycémie...)
                  directement depuis l'application. Plus besoin de noter sur un papier ou de garder en tête :
                  tout est centralisé et historisé par date, accessible en un clic lors de votre prochaine visite.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct à vos fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/app/annotations/new" className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  <span className="font-medium">Nouvelle annotation</span>
                </div>
                <span className="text-xs text-muted-foreground">Enregistrer ou importer un audio</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/app/patients" className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Mes patients</span>
                </div>
                <span className="text-xs text-muted-foreground">{stats.activePatients} patients actifs</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/app/annotations" className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium">Historique</span>
                </div>
                <span className="text-xs text-muted-foreground">{stats.totalAnnotations} annotations</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link to="/app/configuration" className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Configuration</span>
                </div>
                <span className="text-xs text-muted-foreground">Structure et exemples</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Annotations */}
      {annotations.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Annotations récentes</CardTitle>
              <CardDescription>Vos dernières annotations créées</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/annotations">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {annotations.slice(0, 5).map((annotation) => {
                const patient = patients.find(p => p.id === annotation.patient_id);
                return (
                  <div
                    key={annotation.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {patient ? `${patient.last_name} ${patient.first_name}` : "Patient inconnu"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(annotation.visit_date || annotation.created_at), "d MMMM yyyy", { locale: fr })}
                        {annotation.visit_time && ` à ${annotation.visit_time.slice(0, 5)}`}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/app/patients/${annotation.patient_id}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Features */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Bientôt disponible</CardTitle>
          </div>
          <CardDescription>
            Nouvelles fonctionnalités en cours de développement pour la V2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Phrases Feature */}
            <div className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-cyan-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">Templates de phrases</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Créez des phrases récurrentes et insérez-les rapidement dans vos annotations avec des raccourcis clavier personnalisés.
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Clock className="w-3 h-3" />
                    Prochainement
                  </span>
                </div>
              </div>
            </div>

            {/* Tags Feature */}
            <div className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-teal-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">Tags patients</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Organisez et catégorisez vos patients avec des tags colorés (prioritaire, suivi-hebdo, etc.) pour une meilleure gestion.
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Clock className="w-3 h-3" />
                    Prochainement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
