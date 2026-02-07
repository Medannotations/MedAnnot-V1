import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus, Search, Users, FileText, Archive, ArchiveRestore, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { usePatients, useCreatePatient, useArchivePatient, useDeletePatient, type Patient } from "@/hooks/usePatients";
import { GPSNavigationButton } from "@/components/patients/GPSNavigation";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    street: "",
    postalCode: "",
    city: "",
    pathologies: "",
  });

  // Dialog de suppression définitive
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const { data: patients = [], isLoading } = usePatients(true);
  const createPatient = useCreatePatient();
  const archivePatient = useArchivePatient();
  const deletePatient = useDeletePatient();

  const handleCreatePatient = async () => {
    if (!newPatient.firstName.trim() || !newPatient.lastName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le prénom sont requis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fullAddress = [newPatient.street, newPatient.postalCode, newPatient.city]
        .filter(Boolean)
        .join(", ");

      await createPatient.mutateAsync({
        first_name: newPatient.firstName.trim(),
        last_name: newPatient.lastName.trim(),
        address: fullAddress || null,
        street: newPatient.street.trim() || null,
        postal_code: newPatient.postalCode.trim() || null,
        city: newPatient.city.trim() || null,
        pathologies: newPatient.pathologies.trim() || null,
      });

      toast({
        title: "Patient créé",
        description: `${newPatient.firstName} ${newPatient.lastName} a été ajouté.`,
      });

      setNewPatient({ firstName: "", lastName: "", street: "", postalCode: "", city: "", pathologies: "" });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating patient:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le patient. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleArchivePatient = async (id: string) => {
    try {
      await archivePatient.mutateAsync({ id, isArchived: true });
      toast({
        title: "Patient archivé",
        description: "Le patient a été archivé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le patient.",
        variant: "destructive",
      });
    }
  };

  const handleRestorePatient = async (id: string) => {
    try {
      await archivePatient.mutateAsync({ id, isArchived: false });
      toast({
        title: "Patient restauré",
        description: "Le patient a été restauré.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de restaurer le patient.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (patient: Patient) => {
    setPatientToDelete(patient);
    setDeleteConfirmation("");
    setDeleteDialogOpen(true);
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    if (deleteConfirmation !== "supprimer ce patient") {
      toast({
        title: "Erreur",
        description: "Vous devez écrire exactement 'supprimer ce patient' pour confirmer.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deletePatient.mutateAsync(patientToDelete.id);
      toast({
        title: "Patient supprimé",
        description: `${patientToDelete.first_name} ${patientToDelete.last_name} a été définitivement supprimé.`,
      });
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
      setDeleteConfirmation("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le patient.",
        variant: "destructive",
      });
    }
  };

  const activePatients = patients.filter(
    (p) =>
      !p.is_archived &&
      (p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const archivedPatients = patients.filter(
    (p) =>
      p.is_archived &&
      (p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const PatientCard = ({ patient, isArchived }: { patient: Patient; isArchived: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Info patient */}
          <div className="min-w-0">
            <Link
              to={`/app/patients/${patient.id}`}
              className="text-lg font-medium text-card-foreground hover:text-primary transition-colors block truncate"
            >
              {patient.last_name} {patient.first_name}
            </Link>
            {patient.address && (
              <p className="text-sm text-muted-foreground truncate">{patient.address}</p>
            )}
            {patient.pathologies && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                Pathologies: {patient.pathologies}
              </p>
            )}
          </div>
          
          {/* Actions principales - boutons larges */}
          <div className="flex items-center gap-3">
            <Button asChild variant="default" size="default" className="flex-1 h-12 text-base">
              <Link to={`/app/annotations/new?patientId=${patient.id}`}>
                <FileText className="w-5 h-5 mr-2" />
                Nouvelle annotation
              </Link>
            </Button>
            <GPSNavigationButton patient={patient} />
          </div>
          
          {/* Bouton archive/restaurer/supprimer - ligne séparée, aligné à droite */}
          <div className="flex justify-end pt-1">
            {isArchived ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestorePatient(patient.id)}
                  disabled={archivePatient.isPending}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                  title="Restaurer"
                >
                  <ArchiveRestore className="w-3.5 h-3.5 mr-1" />
                  Restaurer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(patient)}
                  disabled={deletePatient.isPending}
                  className="h-7 px-2 text-xs text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                  title="Supprimer définitivement"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Supprimer
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleArchivePatient(patient.id)}
                disabled={archivePatient.isPending}
                className="h-7 px-2 text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
                title="Archiver"
              >
                <Archive className="w-3.5 h-3.5 mr-1" />
                Archiver
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes patients</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gérez vos patients et leurs annotations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Nouveau patient</DialogTitle>
              <DialogDescription>
                Ajoutez les informations du patient pour la navigation GPS et les visites
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Nom *</Label>
                  <Input
                    id="lastName"
                    value={newPatient.lastName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, lastName: e.target.value })
                    }
                    placeholder="Dupont"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={newPatient.firstName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, firstName: e.target.value })
                    }
                    placeholder="Marie"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Adresse détaillée */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  Adresse complète
                  <span className="text-xs text-muted-foreground font-normal">(pour la navigation GPS)</span>
                </Label>
                
                <div className="space-y-2">
                  <Input
                    id="street"
                    value={newPatient.street}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, street: e.target.value })
                    }
                    placeholder="Rue et numéro"
                    className="h-11"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="postalCode"
                    value={newPatient.postalCode}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, postalCode: e.target.value })
                    }
                    placeholder="Code postal"
                    className="h-11"
                  />
                  <Input
                    id="city"
                    value={newPatient.city}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, city: e.target.value })
                    }
                    placeholder="Ville"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Pathologies */}
              <div className="space-y-2">
                <Label htmlFor="pathologies" className="text-sm font-medium">Pathologies connues</Label>
                <Textarea
                  id="pathologies"
                  value={newPatient.pathologies}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, pathologies: e.target.value })
                  }
                  placeholder="Diabète type 2, Hypertension..."
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreatePatient}
                  disabled={createPatient.isPending}
                  className="w-full sm:w-auto"
                >
                  {createPatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Créer le patient
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex items-center gap-2 flex-1 sm:flex-none">
            <Users className="w-4 h-4" />
            <span>Actifs ({activePatients.length})</span>
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2 flex-1 sm:flex-none">
            <Archive className="w-4 h-4" />
            <span>Archivés ({archivedPatients.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activePatients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun patient actif</p>
              <p className="text-sm">Créez votre premier patient pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} isArchived={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {archivedPatients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Archive className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucun patient archivé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {archivedPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} isArchived={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Suppression définitive
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Vous êtes sur le point de supprimer définitivement <strong>{patientToDelete?.first_name} {patientToDelete?.last_name}</strong>.
              </p>
              <p className="text-destructive font-medium">
                Cette action est irréversible. Toutes les annotations associées seront également supprimées.
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Pour confirmer, écrivez exactement :</p>
                <code className="bg-background px-2 py-1 rounded text-destructive">supprimer ce patient</code>
              </div>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Écrivez 'supprimer ce patient'"
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              disabled={deleteConfirmation !== "supprimer ce patient" || deletePatient.isPending}
              className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
            >
              {deletePatient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
