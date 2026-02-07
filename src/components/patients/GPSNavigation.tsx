import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, ExternalLink, X } from "lucide-react";
import type { Patient } from "@/hooks/usePatients";
import { cn } from "@/lib/utils";

interface GPSNavigationProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

type GPSApp = {
  id: string;
  name: string;
  icon: string;
  iosScheme: string;
  androidScheme: string;
  webUrl: (address: string) => string;
};

const GPS_APPS: GPSApp[] = [
  {
    id: "google-maps",
    name: "Google Maps",
    icon: "🗺️",
    iosScheme: "comgooglemaps://?daddr=",
    androidScheme: "geo:0,0?q=",
    webUrl: (addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`,
  },
  {
    id: "waze",
    name: "Waze",
    icon: "🚗",
    iosScheme: "waze://?q=",
    androidScheme: "waze://?q=",
    webUrl: (addr) => `https://www.waze.com/ul?q=${encodeURIComponent(addr)}`,
  },
  {
    id: "apple-plans",
    name: "Plans (Apple)",
    icon: "🍎",
    iosScheme: "http://maps.apple.com/?daddr=",
    androidScheme: "",
    webUrl: (addr) => `http://maps.apple.com/?daddr=${encodeURIComponent(addr)}`,
  },
  {
    id: "mappy",
    name: "Mappy",
    icon: "📍",
    iosScheme: "",
    androidScheme: "",
    webUrl: (addr) => `https://www.mappy.com/#/1/M2/TItinerary/IFR${encodeURIComponent(addr)}`,
  },
];

// Détecter la plateforme
function detectPlatform(): "ios" | "android" | "desktop" {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  if (/android/.test(userAgent)) return "android";
  return "desktop";
}

// Construire l'adresse complète
function buildFullAddress(patient: Patient): string {
  const parts: string[] = [];
  if (patient.street) parts.push(patient.street);
  if (patient.postal_code) parts.push(patient.postal_code);
  if (patient.city) parts.push(patient.city);
  if (parts.length === 0 && patient.address) {
    // Fallback sur l'ancien champ address
    return patient.address;
  }
  return parts.join(", ");
}

export function GPSNavigation({ patient, isOpen, onClose }: GPSNavigationProps) {
  const [preferredApp, setPreferredApp] = useState<string>(() => {
    return localStorage.getItem("medannot_preferred_gps") || "google-maps";
  });
  const [showAllApps, setShowAllApps] = useState(false);

  if (!patient) return null;

  const fullAddress = buildFullAddress(patient);
  const hasAddress = fullAddress && fullAddress.trim() !== "";
  const platform = detectPlatform();

  const savePreference = (appId: string) => {
    setPreferredApp(appId);
    localStorage.setItem("medannot_preferred_gps", appId);
  };

  const openNavigation = (app: GPSApp) => {
    savePreference(app.id);
    
    if (!hasAddress) return;

    // Essayer d'ouvrir l'app native d'abord
    if (platform === "ios" && app.iosScheme) {
      const scheme = app.iosScheme + encodeURIComponent(fullAddress);
      window.location.href = scheme;
      
      // Fallback sur web après 2 secondes si l'app ne s'ouvre pas
      setTimeout(() => {
        window.open(app.webUrl(fullAddress), "_blank");
      }, 2000);
    } else if (platform === "android" && app.androidScheme) {
      const scheme = app.androidScheme + encodeURIComponent(fullAddress);
      window.location.href = scheme;
      
      setTimeout(() => {
        window.open(app.webUrl(fullAddress), "_blank");
      }, 2000);
    } else {
      // Desktop ou fallback
      window.open(app.webUrl(fullAddress), "_blank");
    }
  };

  const filteredApps = GPS_APPS.filter(app => {
    if (platform === "android" && app.id === "apple-plans") return false;
    return true;
  });

  const preferredAppData = filteredApps.find(app => app.id === preferredApp) || filteredApps[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Navigation GPS
          </DialogTitle>
          <DialogDescription>
            {hasAddress ? (
              <>Naviguer vers <strong>{patient.last_name} {patient.first_name}</strong></>
            ) : (
              <>Aucune adresse renseignée pour ce patient</>
            )}
          </DialogDescription>
        </DialogHeader>

        {!hasAddress ? (
          <div className="text-center py-6">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              L'adresse du patient n'est pas complète.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ajoutez rue, code postal et ville dans le profil.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Adresse */}
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{patient.last_name} {patient.first_name}</p>
                    <p className="text-sm text-muted-foreground">{fullAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App préférée - Bouton principal */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Ouvrir avec</p>
              <Button 
                size="lg" 
                className="w-full gap-2"
                onClick={() => openNavigation(preferredAppData)}
              >
                <span className="text-xl">{preferredAppData.icon}</span>
                <span>{preferredAppData.name}</span>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </div>

            {/* Autres options */}
            {!showAllApps ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => setShowAllApps(true)}
              >
                Choisir une autre application
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Autres applications</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setShowAllApps(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {filteredApps.filter(app => app.id !== preferredApp).map(app => (
                    <Button
                      key={app.id}
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => openNavigation(app)}
                    >
                      <span className="text-xl">{app.icon}</span>
                      <span>{app.name}</span>
                      {app.id === "google-maps" && (
                        <span className="ml-auto text-xs text-muted-foreground">Recommandé</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Info plateforme */}
            <p className="text-xs text-muted-foreground text-center">
              {platform === "ios" && "iPhone détecté - Ouverture dans l'app native"}
              {platform === "android" && "Android détecté - Ouverture dans l'app native"}
              {platform === "desktop" && "Ordinateur détecté - Ouverture dans le navigateur"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Composant bouton pour la liste des patients
export function GPSNavigationButton({ patient, variant = "outline" }: { patient: Patient; variant?: "ghost" | "outline" | "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasAddress = patient.street || patient.address || patient.city;
  
  return (
    <>
      <Button
        variant={hasAddress ? "default" : "outline"}
        size="icon"
        onClick={() => setIsOpen(true)}
        disabled={!hasAddress}
        title={hasAddress ? "Naviguer vers ce patient" : "Adresse non renseignée"}
        className={hasAddress ? "bg-blue-600 hover:bg-blue-700 shrink-0" : "shrink-0"}
      >
        <Navigation className="w-4 h-4" />
      </Button>
      <GPSNavigation 
        patient={patient} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}

// Hook pour ouvrir rapidement la navigation
export function useGPSNavigation() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openNavigation = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  const closeNavigation = () => {
    setIsOpen(false);
    setSelectedPatient(null);
  };

  return {
    GPSDialog: (
      <GPSNavigation 
        patient={selectedPatient} 
        isOpen={isOpen} 
        onClose={closeNavigation} 
      />
    ),
    openNavigation,
    closeNavigation,
    isOpen,
    selectedPatient,
    setSelectedPatient,
    setIsOpen,
  };
}
