import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { ChangePasswordSection } from "@/components/settings/ChangePasswordSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Loader2,
  Save,
  Mail,
  Key,
  Smartphone,
  LogOut
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, resetPassword, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        {/* TabsList responsive - scrollable sur mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-max min-w-full sm:w-auto sm:min-w-0 grid grid-cols-4 sm:inline-flex">
            <TabsTrigger value="account" className="gap-1 sm:gap-2 px-2 sm:px-4">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Compte</span>
              <span className="sm:hidden text-xs">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-1 sm:gap-2 px-2 sm:px-4">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Abonnement</span>
              <span className="sm:hidden text-xs">Abonn.</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1 sm:gap-2 px-2 sm:px-4">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Apparence</span>
              <span className="sm:hidden text-xs">Appar.</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1 sm:gap-2 px-2 sm:px-4">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Sécurité</span>
              <span className="sm:hidden text-xs">Sécur.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Onglet Compte */}
        <TabsContent value="account" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Informations personnelles</CardTitle>
              <CardDescription className="text-sm">
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Marie Dupont"
                  className="text-sm"
                />
              </div>

              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="gap-2 w-full sm:w-auto"
                size="sm"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Identifiant utilisateur</CardTitle>
              <CardDescription className="text-sm">
                Votre identifiant unique MedAnnot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1.5 rounded text-xs sm:text-sm block overflow-x-auto">
                {user?.id}
              </code>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Abonnement */}
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Thème</CardTitle>
              <CardDescription className="text-sm">
                Choisissez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-sm sm:text-base">Mode d'affichage</p>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez le thème qui vous convient
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Langue</CardTitle>
              <CardDescription className="text-sm">
                Langue de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-2xl">🇫🇷</span>
                <div>
                  <p className="font-medium text-sm sm:text-base text-foreground">Français (Suisse)</p>
                  <p className="text-xs sm:text-sm">Autres langues bientôt disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <ChangePasswordSection />

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Sessions actives</CardTitle>
              <CardDescription className="text-sm">
                Gérez vos sessions de connexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Cette session</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} • Actif maintenant
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit text-xs">Actuelle</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-destructive flex items-center gap-2 text-lg sm:text-xl">
                <LogOut className="w-5 h-5" />
                Déconnexion
              </CardTitle>
              <CardDescription className="text-sm">
                Déconnectez-vous de votre compte sur cet appareil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="gap-2 w-full sm:w-auto"
                onClick={logout}
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
