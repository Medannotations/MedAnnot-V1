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
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Users, FileText, Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { usePatients, useCreatePatient, useArchivePatient, type Patient } from "@/hooks/usePatients";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    address: "",
    pathologies: "",
  });

  const { data: patients = [], isLoading } = usePatients(true);
  const createPatient = useCreatePatient();
  const archivePatient = useArchivePatient();

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
      await createPatient.mutateAsync({
        first_name: newPatient.firstName.trim(),
        last_name: newPatient.lastName.trim(),
        address: newPatient.address.trim() || null,
        pathologies: newPatient.pathologies.trim() || null,
      });

      toast({
        title: "Patient créé",
        description: `${newPatient.firstName} ${newPatient.lastName} a été ajouté.`,
      });

      setNewPatient({ firstName: "", lastName: "", address: "", pathologies: "" });
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
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <Link
              to={`/app/patients/${patient.id}`}
              className="text-lg font-medium text-card-foreground hover:text-primary transition-colors"
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
          <div className="flex items-center gap-2 ml-4">
            <Button asChild variant="outline" size="sm">
              <Link to={`/app/annotations/new?patientId=${patient.id}`}>
                <FileText className="w-4 h-4 mr-1" />
                Annotation
              </Link>
            </Button>
            {isArchived ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRestorePatient(patient.id)}
                disabled={archivePatient.isPending}
              >
                <ArchiveRestore className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleArchivePatient(patient.id)}
                disabled={archivePatient.isPending}
              >
                <Archive className="w-4 h-4" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes patients</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gérez vos patients et leurs annotations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau patient</DialogTitle>
              <DialogDescription>
                Ajoutez les informations du patient
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={newPatient.lastName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, lastName: e.target.value })
                    }
                    placeholder="Dupont"
                    className="bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={newPatient.firstName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, firstName: e.target.value })
                    }
                    placeholder="Marie"
                    className="bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                  placeholder="Rue de Lausanne 12, 1000 Lausanne"
                  className="bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pathologies">Pathologies connues</Label>
                <Textarea
                  id="pathologies"
                  value={newPatient.pathologies}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, pathologies: e.target.value })
                  }
                  placeholder="Diabète type 2, Hypertension..."
                  className="min-h-[80px] bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreatePatient}
                  disabled={createPatient.isPending}
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
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Actifs ({activePatients.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archivés ({archivedPatients.length})
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
    </div>
  );
}
