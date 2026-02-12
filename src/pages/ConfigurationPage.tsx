import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, FileText, Loader2, Lightbulb, MessageSquare, Tag, Palette, Sparkles } from "lucide-react";
import { aiGeneration } from "@/services/api";
import {
  useUserConfiguration,
  useUpdateConfiguration,
  useExampleAnnotations,
  useCreateExample,
  useUpdateExample,
  useDeleteExample,
  usePhraseTemplates,
  useCreatePhraseTemplate,
  useUpdatePhraseTemplate,
  useDeletePhraseTemplate,
  usePatientTags,
  useCreatePatientTag,
  useDeletePatientTag,
  type ExampleAnnotation,
  type PhraseTemplate,
  type PatientTag,
} from "@/hooks/useConfiguration";

const DEFAULT_STRUCTURE = `Motif et contexte de la visite
Prescripteur:

Evaluation clinique
Etat général et autonomie (AVQ):
Constantes vitales:
Observations spécifiques:

Soins réalisés
Soins infirmiers (OPAS cat. C):
Soins techniques (OPAS cat. A):
Education thérapeutique (OPAS cat. B):

Evaluation et évolution
Réaction du patient:
Evolution par rapport à la dernière visite:

Coordination et suite
Communication médecin/équipe:
Objectifs pour la prochaine visite:
Prochaine visite prévue:`;

const EXAMPLE_STRUCTURES = [
  {
    title: "Evaluation complète (admission / patient complexe)",
    description: "Pour évaluations initiales, patients polymorbides et bilans périodiques",
    content: `Motif et contexte
Prescripteur et type de prescription (OMP):
Diagnostic principal et comorbidités:
Antécédents pertinents:

Evaluation fonctionnelle
Autonomie AVQ (hygiène, habillage, alimentation, mobilité, continence):
Autonomie AIVQ (courses, ménage, gestion médicaments, finances):
Echelle de dépendance (Katz ou RAI):
Risque de chute (Tinetti / get up and go):

Evaluation clinique
Etat général et conscience:
Constantes vitales (TA, FC, T°, SpO2, glycémie, poids):
Etat cutané et tégumentaire:
Douleur (localisation, EVA, type):
Etat psychique et cognitif:
Nutrition et hydratation:

Soins réalisés
Soins techniques (OPAS cat. A):
Soins infirmiers de base (OPAS cat. C):
Education thérapeutique (OPAS cat. B):
Médicaments administrés:

Diagnostic infirmier et objectifs
Problématiques identifiées:
Objectifs de soins à court terme:
Objectifs de soins à moyen terme:

Coordination et suite
Communication au médecin prescripteur:
Transmission à l'équipe:
Intervenants impliqués (physio, ergo, diététicienne):
Fréquence des visites prévue:
Prochaine visite prévue:`
  },
  {
    title: "Visite standard (quotidien)",
    description: "Le modèle de tous les jours - concis mais couvre les essentiels OPAS",
    content: `Motif et contexte de la visite
Prescripteur:

Evaluation clinique
Etat général et autonomie (AVQ):
Constantes vitales:
Observations spécifiques:

Soins réalisés
Soins infirmiers (OPAS cat. C):
Soins techniques (OPAS cat. A):
Education thérapeutique (OPAS cat. B):

Evaluation et évolution
Réaction du patient:
Evolution par rapport à la dernière visite:

Coordination et suite
Communication médecin/équipe:
Objectifs pour la prochaine visite:
Prochaine visite prévue:`
  },
  {
    title: "Suivi rapide (intervention ciblée)",
    description: "Pour visites courtes : prise de sang, injection, contrôle de constantes",
    content: `Motif de l'intervention
Type de soin (OPAS cat.):

Réalisation
Acte effectué:
Constantes relevées:
Réaction / tolérance:

Suite
Observations particulières:
Transmission:
Prochaine intervention:`
  },
  {
    title: "Suivi de plaie et cicatrisation",
    description: "Spécialisé pour plaies chroniques et post-opératoires",
    content: `Motif et contexte
Type de plaie et localisation:
Prescripteur:
Etiologie (vasculaire, diabétique, pression, post-op):

Evaluation de la plaie
Dimensions (L x l x profondeur en cm):
Lit de la plaie (granulation, fibrine, nécrose, %):
Exsudat (quantité, couleur, odeur):
Berges (adhérentes, décollées, macérées, hyperkératose):
Peau péri-lésionnelle:
Signes d'infection (rougeur, chaleur, douleur, écoulement):
Douleur (EVA, au repos / au soin):

Soin réalisé (OPAS cat. A)
Nettoyage:
Détersion / débridement:
Pansement primaire appliqué:
Pansement secondaire:
Contention / décharge:

Evaluation et évolution
Evolution par rapport au dernier soin:
Photo prise (oui/non):

Coordination et suite
Communication au médecin:
Fréquence de réfection:
Prochaine visite prévue:`
  }
];

const DEFAULT_PHRASE_CATEGORIES = [
  "État général",
  "Observations",
  "Soins",
  "Évaluation",
  "Plan de soins",
  "Autre"
];

const TAG_COLORS = [
  { name: "Rouge", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Jaune", value: "#eab308" },
  { name: "Vert", value: "#22c55e" },
  { name: "Bleu", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#a855f7" },
  { name: "Rose", value: "#ec4899" },
  { name: "Gris", value: "#6b7280" },
];

export default function ConfigurationPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "structure";
  const [structure, setStructure] = useState(DEFAULT_STRUCTURE);
  
  // Dialog states
  const [isExampleDialogOpen, setIsExampleDialogOpen] = useState(false);
  const [isPhraseDialogOpen, setIsPhraseDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  
  // Form states
  const [editingExample, setEditingExample] = useState<ExampleAnnotation | null>(null);
  const [exampleForm, setExampleForm] = useState({ title: "", content: "" });
  
  const [editingPhrase, setEditingPhrase] = useState<PhraseTemplate | null>(null);
  const [phraseForm, setPhraseForm] = useState({ 
    category: "", 
    label: "", 
    content: "",
    shortcut: "" 
  });
  
  const [tagForm, setTagForm] = useState({ name: "", color: "#3b82f6" });

  // Analyze structure states
  const [annotationToAnalyze, setAnnotationToAnalyze] = useState("");
  const [analyzedStructure, setAnalyzedStructure] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Data fetching
  const { data: config, isLoading: configLoading } = useUserConfiguration();
  const { data: examples = [], isLoading: examplesLoading } = useExampleAnnotations();
  const { data: phrases = [], isLoading: phrasesLoading } = usePhraseTemplates();
  const { data: tags = [], isLoading: tagsLoading } = usePatientTags();
  
  // Mutations
  const updateConfiguration = useUpdateConfiguration();
  const createExample = useCreateExample();
  const updateExample = useUpdateExample();
  const deleteExample = useDeleteExample();
  const createPhrase = useCreatePhraseTemplate();
  const updatePhrase = useUpdatePhraseTemplate();
  const deletePhrase = useDeletePhraseTemplate();
  const createTag = useCreatePatientTag();
  const deleteTag = useDeletePatientTag();

  useEffect(() => {
    if (config?.annotation_structure) {
      setStructure(config.annotation_structure);
    }
  }, [config]);

  // ==================== Structure ====================

  const handleSaveStructure = async () => {
    try {
      await updateConfiguration.mutateAsync(structure);
      toast({
        title: "Structure sauvegardée",
        description: "Votre structure d'annotation a été mise à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la structure.",
        variant: "destructive",
      });
    }
  };

  // ==================== Analyze Structure ====================

  const handleAnalyzeStructure = async () => {
    if (!annotationToAnalyze.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez coller une annotation à analyser.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalyzedStructure(null);

    try {
      const result = await aiGeneration.analyzeStructure(annotationToAnalyze);
      setAnalyzedStructure(result.structure);
      toast({
        title: "Analyse terminée",
        description: "La structure a été extraite avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'annotation. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==================== Examples ====================

  const openNewExample = () => {
    setEditingExample(null);
    setExampleForm({ title: "", content: "" });
    setIsExampleDialogOpen(true);
  };

  const openEditExample = (example: ExampleAnnotation) => {
    setEditingExample(example);
    setExampleForm({ title: example.title, content: example.content });
    setIsExampleDialogOpen(true);
  };

  const handleSaveExample = async () => {
    if (!exampleForm.title.trim() || !exampleForm.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingExample) {
        await updateExample.mutateAsync({
          id: editingExample.id,
          ...exampleForm,
        });
        toast({ title: "Exemple modifié" });
      } else {
        await createExample.mutateAsync(exampleForm);
        toast({ title: "Exemple ajouté" });
      }
      setIsExampleDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'exemple.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExample = async (id: string) => {
    try {
      await deleteExample.mutateAsync(id);
      toast({ title: "Exemple supprimé" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'exemple.",
        variant: "destructive",
      });
    }
  };

  // ==================== Phrases ====================

  const openNewPhrase = () => {
    setEditingPhrase(null);
    setPhraseForm({ category: "", label: "", content: "", shortcut: "" });
    setIsPhraseDialogOpen(true);
  };

  const openEditPhrase = (phrase: PhraseTemplate) => {
    setEditingPhrase(phrase);
    setPhraseForm({
      category: phrase.category,
      label: phrase.label,
      content: phrase.content,
      shortcut: phrase.shortcut || "",
    });
    setIsPhraseDialogOpen(true);
  };

  const handleSavePhrase = async () => {
    if (!phraseForm.category.trim() || !phraseForm.label.trim() || !phraseForm.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingPhrase) {
        await updatePhrase.mutateAsync({
          id: editingPhrase.id,
          ...phraseForm,
        });
        toast({ title: "Phrase modifiée" });
      } else {
        await createPhrase.mutateAsync(phraseForm);
        toast({ title: "Phrase ajoutée" });
      }
      setIsPhraseDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la phrase.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhrase = async (id: string) => {
    try {
      await deletePhrase.mutateAsync(id);
      toast({ title: "Phrase supprimée" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la phrase.",
        variant: "destructive",
      });
    }
  };

  // ==================== Tags ====================

  const handleCreateTag = async () => {
    if (!tagForm.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour le tag.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTag.mutateAsync(tagForm);
      toast({ title: "Tag créé" });
      setTagForm({ name: "", color: "#3b82f6" });
      setIsTagDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le tag.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id);
      toast({ title: "Tag supprimé" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le tag.",
        variant: "destructive",
      });
    }
  };

  // ==================== Group phrases by category ====================

  const phrasesByCategory = phrases.reduce((acc, phrase) => {
    const cat = phrase.category || "Autre";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(phrase);
    return acc;
  }, {} as Record<string, PhraseTemplate[]>);

  const isLoading = configLoading || examplesLoading || phrasesLoading || tagsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Configuration</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Personnalisez votre expérience et optimisez vos annotations
        </p>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Structure</span>
          </TabsTrigger>
          {/* Phrases et Tags - DÉSACTIVÉS - Bientôt disponible */}
          {/* <TabsTrigger value="phrases" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Phrases</span>
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Tags</span>
          </TabsTrigger> */}
        </TabsList>

        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ma structure d'annotation
              </CardTitle>
              <CardDescription>
                Définissez la structure que l'IA doit suivre pour toutes vos annotations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button 
                onClick={handleSaveStructure}
                disabled={updateConfiguration.isPending}
              >
                {updateConfiguration.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Enregistrer la structure
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Analyser une annotation existante
              </CardTitle>
              <CardDescription>
                Collez une annotation complète que vous aimez, et l'IA en extraira la structure réutilisable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={annotationToAnalyze}
                onChange={(e) => setAnnotationToAnalyze(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                placeholder="Collez ici une annotation complète (avec les données patient)..."
              />
              <Button
                onClick={handleAnalyzeStructure}
                disabled={isAnalyzing || !annotationToAnalyze.trim()}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isAnalyzing ? "Analyse en cours..." : "Analyser"}
              </Button>

              {analyzedStructure && (
                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-medium">Structure extraite :</Label>
                  <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                    {analyzedStructure}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStructure(analyzedStructure);
                      toast({
                        title: "Structure copiée",
                        description: "N'oubliez pas de l'enregistrer avec le bouton ci-dessus.",
                      });
                    }}
                  >
                    Utiliser cette structure
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Exemples de structures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXAMPLE_STRUCTURES.map((example, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">{example.title}</CardTitle>
                    <CardDescription className="text-sm">{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-background p-3 rounded-md whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                      {example.content}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setStructure(example.content);
                        toast({
                          title: "Structure copiée",
                          description: "Vous pouvez maintenant la personnaliser"
                        });
                      }}
                    >
                      Utiliser cette structure
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        {/* Phrases Tab - DÉSACTIVÉ - Bientôt disponible */}
        {/* <TabsContent value="phrases" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Templates de phrases</CardTitle>
                  <CardDescription>
                    Créez des phrases récurrentes pour les insérer rapidement dans vos annotations.
                  </CardDescription>
                </div>
                <Button onClick={openNewPhrase}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {phrases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Aucune phrase enregistrée.</p>
                  <p className="text-sm">Créez des templates pour accélérer votre saisie.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(phrasesByCategory).map(([category, categoryPhrases]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">{category}</h4>
                      <div className="space-y-2">
                        {categoryPhrases.map((phrase) => (
                          <Card key={phrase.id} className="bg-muted/30">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{phrase.label}</span>
                                    {phrase.shortcut && (
                                      <Badge variant="outline" className="text-xs">
                                        {phrase.shortcut}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {phrase.content}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => openEditPhrase(phrase)}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDeletePhrase(phrase.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Tags Tab - DÉSACTIVÉ - Bientôt disponible */}
        {/* <TabsContent value="tags" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tags patients</CardTitle>
                  <CardDescription>
                    Créez des tags pour organiser et catégoriser vos patients.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsTagDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Aucun tag créé.</p>
                  <p className="text-sm">Les tags vous aident à organiser vos patients.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{ backgroundColor: tag.color }}
                      className="text-white px-3 py-1.5 text-sm cursor-pointer hover:opacity-80"
                    >
                      {tag.name}
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="ml-2 hover:text-white/80"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Example Dialog */}
      <Dialog open={isExampleDialogOpen} onOpenChange={setIsExampleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExample ? "Modifier l'exemple" : "Nouvel exemple d'annotation"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={exampleForm.title}
                onChange={(e) => setExampleForm({ ...exampleForm, title: e.target.value })}
                placeholder="Ex: Visite de contrôle diabétique"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea
                value={exampleForm.content}
                onChange={(e) => setExampleForm({ ...exampleForm, content: e.target.value })}
                className="min-h-[250px]"
                placeholder="Rédigez un exemple complet d'annotation..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExampleDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveExample}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phrase Dialog */}
      <Dialog open={isPhraseDialogOpen} onOpenChange={setIsPhraseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPhrase ? "Modifier la phrase" : "Nouvelle phrase"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Input
                  value={phraseForm.category}
                  onChange={(e) => setPhraseForm({ ...phraseForm, category: e.target.value })}
                  placeholder="Ex: État général"
                  list="phrase-categories"
                />
                <datalist id="phrase-categories">
                  {DEFAULT_PHRASE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  value={phraseForm.label}
                  onChange={(e) => setPhraseForm({ ...phraseForm, label: e.target.value })}
                  placeholder="Ex: Patient collaboratif"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contenu *</Label>
              <Textarea
                value={phraseForm.content}
                onChange={(e) => setPhraseForm({ ...phraseForm, content: e.target.value })}
                className="min-h-[150px]"
                placeholder="Le texte qui sera inséré..."
              />
            </div>
            <div className="space-y-2">
              <Label>Raccourci (optionnel)</Label>
              <Input
                value={phraseForm.shortcut}
                onChange={(e) => setPhraseForm({ ...phraseForm, shortcut: e.target.value })}
                placeholder="Ex: /collab"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPhraseDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSavePhrase}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={tagForm.name}
                onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                placeholder="Ex: Urgent"
              />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTagForm({ ...tagForm, color: color.value })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      tagForm.color === color.value ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateTag}>
                <Plus className="w-4 h-4 mr-2" />
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
