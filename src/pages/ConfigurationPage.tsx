import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, FileText, Loader2, Lightbulb } from "lucide-react";
import {
  useUserConfiguration,
  useUpdateConfiguration,
  useExampleAnnotations,
  useCreateExample,
  useUpdateExample,
  useDeleteExample,
  type ExampleAnnotation,
} from "@/hooks/useConfiguration";

const DEFAULT_STRUCTURE = `1. Motif de la visite
2. Observations cliniques
   - État général
   - Signes vitaux
   - Observations spécifiques
3. Soins prodigués
4. Évaluation
5. Plan de soins`;

const EXAMPLE_STRUCTURES = [
  {
    title: "Structure complète (détaillée)",
    description: "Pour des annotations très complètes avec tous les détails",
    content: `1. Identification
   - Patient: [Nom, Prénom]
   - Date et heure de visite
   - Durée de la prestation

2. Motif de la visite et contexte
   - Raison de l'intervention
   - Antécédents pertinents

3. Observations cliniques
   - État général du patient
   - Paramètres vitaux (TA, pouls, température, etc.)
   - État cutané, mobilité, douleur
   - État psychologique et cognitif

4. Soins prodigués
   - Soins d'hygiène
   - Soins techniques (pansements, injections, etc.)
   - Administration de médicaments
   - Autres interventions

5. Évaluation
   - Réaction du patient aux soins
   - Évolution de l'état de santé
   - Difficultés rencontrées

6. Plan de soins et suivi
   - Recommandations
   - Prochaine visite
   - Points de vigilance`
  },
  {
    title: "Structure concise (essentielle)",
    description: "Pour des annotations rapides avec l'essentiel",
    content: `1. Motif de visite
2. État du patient
3. Soins effectués
4. Observations et suivi`
  },
  {
    title: "Structure chronologique",
    description: "Organisation par ordre chronologique de la visite",
    content: `Arrivée (HH:MM)
- État du patient à l'arrivée
- Plaintes ou demandes

Soins prodigués
- [Liste des soins dans l'ordre chronologique]

Fin de visite (HH:MM)
- État du patient au départ
- Instructions données
- Prochaine intervention`
  },
  {
    title: "Structure par systèmes",
    description: "Pour patients complexes avec problèmes multiples",
    content: `Respiratoire
- Observations et soins

Cardiovasculaire
- Observations et soins

Digestif
- Observations et soins

Neurologique/Psychologique
- Observations et soins

Tégumentaire (peau)
- Observations et soins

Mobilité
- Observations et soins

Plan de soins
- Suivi et recommandations`
  }
];

export default function ConfigurationPage() {
  const [structure, setStructure] = useState(DEFAULT_STRUCTURE);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExample, setEditingExample] = useState<ExampleAnnotation | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const { data: config, isLoading: configLoading } = useUserConfiguration();
  const { data: examples = [], isLoading: examplesLoading } = useExampleAnnotations();
  const updateConfiguration = useUpdateConfiguration();
  const createExample = useCreateExample();
  const updateExample = useUpdateExample();
  const deleteExample = useDeleteExample();

  useEffect(() => {
    if (config?.annotation_structure) {
      setStructure(config.annotation_structure);
    }
  }, [config]);

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

  const handleSaveExample = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
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
          title: newTitle.trim(),
          content: newContent.trim(),
        });
        toast({
          title: "Exemple modifié",
          description: "Votre exemple d'annotation a été mis à jour.",
        });
      } else {
        await createExample.mutateAsync({
          title: newTitle.trim(),
          content: newContent.trim(),
        });
        toast({
          title: "Exemple ajouté",
          description: "Votre exemple d'annotation a été sauvegardé.",
        });
      }

      setIsDialogOpen(false);
      setEditingExample(null);
      setNewTitle("");
      setNewContent("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'exemple.",
        variant: "destructive",
      });
    }
  };

  const handleEditExample = (example: ExampleAnnotation) => {
    setEditingExample(example);
    setNewTitle(example.title);
    setNewContent(example.content);
    setIsDialogOpen(true);
  };

  const handleDeleteExample = async (id: string) => {
    try {
      await deleteExample.mutateAsync(id);
      toast({
        title: "Exemple supprimé",
        description: "L'exemple d'annotation a été supprimé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'exemple.",
        variant: "destructive",
      });
    }
  };

  const handleOpenNewDialog = () => {
    setEditingExample(null);
    setNewTitle("");
    setNewContent("");
    setIsDialogOpen(true);
  };

  const isLoading = configLoading || examplesLoading;
  const isSavingExample = createExample.isPending || updateExample.isPending;

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
          Personnalisez votre structure d'annotation et ajoutez des exemples pour améliorer l'IA.
        </p>
      </div>

      {/* Structure Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ma structure d'annotation
          </CardTitle>
          <CardDescription>
            Définissez la structure que l'IA doit suivre pour toutes vos annotations.
            Utilisez des numéros, tirets ou autres marqueurs pour organiser les sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Définissez votre structure d'annotation..."
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

      {/* Example Structures Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Exemples de structures
          </CardTitle>
          <CardDescription>
            Inspirez-vous de ces exemples pour créer votre propre structure d'annotation
          </CardDescription>
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

      {/* Examples Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exemples d'annotations</CardTitle>
              <CardDescription>
                Ajoutez des exemples d'annotations rédigées selon votre style pour améliorer la précision de l'IA.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenNewDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un exemple
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingExample ? "Modifier l'exemple" : "Nouvel exemple d'annotation"}
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez un exemple d'annotation bien rédigée pour que l'IA apprenne votre style.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="example-title">Titre de l'exemple</Label>
                    <Input
                      id="example-title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Visite de contrôle diabétique"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="example-content">Contenu de l'annotation</Label>
                    <Textarea
                      id="example-content"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="min-h-[250px]"
                      placeholder="Rédigez un exemple complet d'annotation..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveExample} disabled={isSavingExample}>
                      {isSavingExample && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {examples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun exemple d'annotation pour le moment.</p>
              <p className="text-sm">Ajoutez des exemples pour améliorer la qualité des annotations générées.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {examples.map((example) => (
                <Card key={example.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-card-foreground">{example.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {example.content}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditExample(example)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteExample(example.id)}
                          disabled={deleteExample.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
