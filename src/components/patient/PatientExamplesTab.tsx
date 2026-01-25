import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import type { Patient, PatientExampleAnnotation } from '@/types';

interface PatientExamplesTabProps {
  patient: Patient;
  onUpdatePatient: (patient: Patient) => void;
}

export function PatientExamplesTab({ patient, onUpdatePatient }: PatientExamplesTabProps) {
  const [isAddingExample, setIsAddingExample] = useState(false);
  const [newExample, setNewExample] = useState({
    content: '',
    visitDate: '',
    context: '',
  });

  const examples = patient.exampleAnnotations || [];

  const handleAddExample = () => {
    if (!newExample.content.trim() || !newExample.visitDate) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir le contenu et la date de visite',
        variant: 'destructive',
      });
      return;
    }

    const example: PatientExampleAnnotation = {
      id: `example-${Date.now()}`,
      content: newExample.content,
      visitDate: newExample.visitDate,
      context: newExample.context,
      isLearningExample: true,
      createdAt: new Date().toISOString(),
    };

    const updatedPatient = {
      ...patient,
      exampleAnnotations: [...examples, example],
    };

    onUpdatePatient(updatedPatient);
    setIsAddingExample(false);
    setNewExample({ content: '', visitDate: '', context: '' });

    toast({
      title: 'Exemple ajouté',
      description: 'L\'IA utilisera cet exemple pour apprendre votre style',
    });
  };

  const handleToggleExample = (exampleId: string) => {
    const updatedExamples = examples.map((ex) =>
      ex.id === exampleId ? { ...ex, isLearningExample: !ex.isLearningExample } : ex
    );

    onUpdatePatient({
      ...patient,
      exampleAnnotations: updatedExamples,
    });
  };

  const handleDeleteExample = (exampleId: string) => {
    const updatedExamples = examples.filter((ex) => ex.id !== exampleId);

    onUpdatePatient({
      ...patient,
      exampleAnnotations: updatedExamples,
    });

    toast({
      title: 'Exemple supprimé',
      description: 'L\'exemple a été retiré',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Exemples d'annotations pour l'apprentissage de l'IA
              </h3>
              <p className="text-sm text-blue-700">
                Ces annotations servent de référence à l'IA pour comprendre :
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                <li>Votre style de rédaction pour ce patient</li>
                <li>Les antécédents et pathologies spécifiques</li>
                <li>Le contexte de suivi habituel</li>
              </ul>
              <p className="text-xs text-blue-600 mt-3">
                💡 Plus vous ajoutez d'exemples, plus l'IA sera précise pour ce patient spécifique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Example Button */}
      <div>
        <Dialog open={isAddingExample} onOpenChange={setIsAddingExample}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un exemple d'annotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un exemple d'annotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="visitDate">Date de la visite</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={newExample.visitDate}
                  onChange={(e) => setNewExample({ ...newExample, visitDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="context">Contexte (optionnel)</Label>
                <Input
                  id="context"
                  placeholder="Ex: Contrôle post-opératoire, visite de routine..."
                  value={newExample.context}
                  onChange={(e) => setNewExample({ ...newExample, context: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Annotation complète</Label>
                <Textarea
                  id="content"
                  rows={15}
                  placeholder="Collez ou tapez une annotation complète et bien rédigée..."
                  value={newExample.content}
                  onChange={(e) => setNewExample({ ...newExample, content: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddingExample(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddExample}>Ajouter l'exemple</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Examples List */}
      {examples.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Aucun exemple d'annotation pour le moment</p>
            <p className="text-sm text-muted-foreground">
              Ajoutez des exemples pour aider l'IA à mieux comprendre le contexte de ce patient
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {examples.map((example) => (
            <Card
              key={example.id}
              className={
                example.isLearningExample
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-muted bg-muted/30'
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      📄 Exemple - Visite du {new Date(example.visitDate).toLocaleDateString('fr-CH')}
                      {example.isLearningExample && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-normal">
                          Actif
                        </span>
                      )}
                    </CardTitle>
                    {example.context && (
                      <p className="text-sm text-muted-foreground mt-1">{example.context}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={example.isLearningExample}
                        onCheckedChange={() => handleToggleExample(example.id)}
                        aria-label="Utiliser pour l'IA"
                      />
                      {example.isLearningExample ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExample(example.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Voir le contenu complet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Annotation du {new Date(example.visitDate).toLocaleDateString('fr-CH')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
                        {example.content}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
