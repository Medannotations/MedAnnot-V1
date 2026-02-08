import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Loader2,
  Save,
  Mail,
  Key
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, resetPassword } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Simuler la mise à jour - à connecter avec votre API
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
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Compte */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
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
                />
              </div>

              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="gap-2"
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
            <CardHeader>
              <CardTitle>Identifiant utilisateur</CardTitle>
              <CardDescription>
                Votre identifiant unique MedAnnot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="bg-muted px-2 py-1 rounded text-sm">
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
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>
                Choisissez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode d'affichage</p>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez le thème qui vous convient
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Langue</CardTitle>
              <CardDescription>
                Langue de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">🇫🇷</span>
                <span>Français (Suisse)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Mot de passe
              </CardTitle>
              <CardDescription>
                Réinitialisez votre mot de passe via un lien envoyé par email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Pour des raisons de sécurité, la réinitialisation du mot de passe se fait par email.
                Un lien vous sera envoyé à <strong>{user?.email}</strong> pour choisir un nouveau mot de passe.
              </p>
              <Button
                className="gap-2"
                disabled={isResettingPassword}
                onClick={async () => {
                  if (!user?.email) return;
                  setIsResettingPassword(true);
                  try {
                    await resetPassword(user.email);
                    toast({
                      title: "Email envoyé",
                      description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
                    });
                  } catch (error: any) {
                    toast({
                      title: "Erreur",
                      description: error.message || "Impossible d'envoyer l'email.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsResettingPassword(false);
                  }
                }}
              >
                {isResettingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Envoyer le lien de réinitialisation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez vos sessions de connexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Cette session</p>
                  <p className="text-sm text-muted-foreground">
                    {navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"} • Actuel
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
