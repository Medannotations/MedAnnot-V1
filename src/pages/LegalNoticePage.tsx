import { ArrowLeft, Shield, Server, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LegalNoticePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mentions Légales
          </h1>
          <p className="text-muted-foreground mb-8">
            Informations légales concernant Medannot
          </p>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Éditeur du Site</h2>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>Raison sociale :</strong> [Votre raison sociale complète]</p>
                <p><strong>Forme juridique :</strong> [Société à responsabilité limitée (Sàrl) / Société anonyme (SA) / Raison individuelle]</p>
                <p className="mt-4"><strong>Siège social :</strong></p>
                <p>[Votre adresse complète]</p>
                <p>[Code postal] [Ville]</p>
                <p>Suisse</p>
                <p className="mt-4"><strong>Numéro IDE (Identification des entreprises) :</strong> CHE-[Votre numéro IDE]</p>
                <p><strong>Numéro TVA :</strong> CHE-[Votre numéro TVA].MWST</p>
                <p className="mt-4"><strong>Email de contact :</strong> contact@medannot.ch</p>
                <p><strong>Support technique :</strong> support@medannot.ch</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Direction et Représentation Légale</h2>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>Directeur / Représentant légal :</strong> [Nom et prénom du directeur]</p>
                <p><strong>Fonction :</strong> [Directeur général / Gérant / Administrateur unique]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Hébergement et Infrastructure</h2>

              <div className="grid gap-6">
                <div className="border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">Hébergement Principal</h3>
                  </div>
                  <p><strong>Fournisseur :</strong> Safe Swiss Cloud AG</p>
                  <p><strong>Localisation :</strong> Suisse (datacenters en Suisse uniquement)</p>
                  <p><strong>Certifications :</strong></p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>ISO/IEC 27001 (Sécurité de l'information)</li>
                    <li>Conformité LPD suisse</li>
                    <li>Conformité FINMA pour données financières</li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Site web : <a href="https://www.safewisscloud.ch" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      www.safewisscloud.ch
                    </a>
                  </p>
                </div>

                <div className="border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">Base de Données</h3>
                  </div>
                  <p><strong>Type :</strong> PostgreSQL sécurisée</p>
                  <p><strong>Hébergement :</strong> Safe Swiss Cloud (Suisse)</p>
                  <p><strong>Sécurité :</strong></p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Chiffrement AES-256-GCM au repos</li>
                    <li>Row Level Security (RLS) activée</li>
                    <li>Sauvegardes chiffrées quotidiennes</li>
                    <li>Réplication multi-zones</li>
                  </ul>
                </div>

                <div className="border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">CDN et Performance</h3>
                  </div>
                  <p><strong>Fournisseur :</strong> Cloudflare</p>
                  <p><strong>Fonction :</strong> Accélération et protection DDoS uniquement</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune donnée de santé ne transite par le CDN - uniquement les assets statiques (images, CSS, JS)
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Sous-Traitants et Partenaires</h2>

              <p className="mb-4">
                Conformément à notre <a href="/privacy-policy" className="text-primary hover:underline">
                  Politique de Confidentialité
                </a>, nous travaillons avec les sous-traitants suivants :
              </p>

              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">OpenAI (Whisper API)</p>
                  <p className="text-sm text-muted-foreground">Transcription vocale automatique</p>
                  <p className="text-sm mt-1">
                    <strong>Configuration :</strong> Zero data retention - Les fichiers audio sont immédiatement supprimés après transcription
                  </p>
                  <p className="text-sm">
                    <strong>Localisation :</strong> États-Unis (transfert encadré par clauses contractuelles types UE)
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Anthropic (Claude API)</p>
                  <p className="text-sm text-muted-foreground">Génération intelligente d'annotations</p>
                  <p className="text-sm mt-1">
                    <strong>Configuration :</strong> Zero data retention - Les transcriptions ne sont pas conservées après traitement
                  </p>
                  <p className="text-sm">
                    <strong>Localisation :</strong> États-Unis (transfert encadré par clauses contractuelles types UE)
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Stripe</p>
                  <p className="text-sm text-muted-foreground">Traitement sécurisé des paiements</p>
                  <p className="text-sm mt-1">
                    <strong>Certification :</strong> PCI-DSS Level 1 (plus haut niveau de sécurité paiements)
                  </p>
                  <p className="text-sm">
                    <strong>Localisation :</strong> Union Européenne
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg mt-6">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Garantie de Souveraineté des Données
                </p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Toutes les données de santé à long terme (patients, annotations) sont hébergées EXCLUSIVEMENT
                  en Suisse. Les services IA tiers ne reçoivent que des données temporaires immédiatement supprimées
                  après traitement, sans aucune conservation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Propriété Intellectuelle</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Marques et Logos</h3>
              <p className="mb-4">
                La marque "Medannot", le logo et l'ensemble des éléments graphiques de la plateforme
                sont la propriété exclusive de [Votre raison sociale].
              </p>
              <p className="mb-4">
                Toute reproduction, représentation ou utilisation sans autorisation écrite préalable
                est strictement interdite et constitue une contrefaçon sanctionnée par le Code pénal suisse.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Code Source et Technologie</h3>
              <p className="mb-4">
                Le code source, l'architecture logicielle, les algorithmes et l'ensemble de la technologie
                développée pour Medannot sont protégés par le droit d'auteur suisse.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Vos Données</h3>
              <p className="mb-4">
                Vous conservez l'entière propriété intellectuelle sur :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Toutes les données que vous créez ou importez</li>
                <li>Les annotations générées (même si assistées par IA)</li>
                <li>Vos configurations personnalisées</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Protection des Données</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Délégué à la Protection des Données (DPO)</h3>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>Email :</strong> dpo@medannot.ch</p>
                <p><strong>Fonction :</strong> Contact pour toutes questions relatives à vos données personnelles</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Pour plus d'informations, consultez notre <a href="/privacy-policy" className="text-primary hover:underline">
                    Politique de Confidentialité
                  </a>
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Autorité de Contrôle</h3>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>Préposé fédéral à la protection des données et à la transparence (PFPDT)</strong></p>
                <p className="mt-2">Feldeggweg 1</p>
                <p>CH-3003 Berne</p>
                <p>Suisse</p>
                <p className="mt-3">
                  <strong>Site web :</strong> <a href="https://www.edoeb.admin.ch" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.edoeb.admin.ch
                  </a>
                </p>
                <p><strong>Email :</strong> info@edoeb.admin.ch</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Conformité Légale et Réglementaire</h2>

              <div className="grid gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Loi fédérale sur la protection des données (LPD)</p>
                  <p className="text-sm text-muted-foreground">Conforme à la révision totale de la LPD (en vigueur depuis septembre 2023)</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Code pénal suisse - Art. 321 (Secret professionnel)</p>
                  <p className="text-sm text-muted-foreground">Respect du secret médical et professionnel des soignants</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">RGPD (Règlement Général sur la Protection des Données)</p>
                  <p className="text-sm text-muted-foreground">Application volontaire pour une protection maximale des données</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">ISO/IEC 27001</p>
                  <p className="text-sm text-muted-foreground">Normes de sécurité de l'information appliquées</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Résolution des Litiges</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Contact Préalable</h3>
              <p className="mb-4">
                Pour toute réclamation ou litige, nous vous invitons à contacter en priorité notre
                service client :
              </p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p><strong>Email :</strong> legal@medannot.ch</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Nous nous engageons à répondre dans un délai de 5 jours ouvrables et à rechercher
                  une solution amiable.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Médiation</h3>
              <p className="mb-4">
                En cas de désaccord persistant, vous pouvez faire appel à une procédure de médiation
                conforme au droit suisse.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Juridiction Compétente</h3>
              <p className="mb-4">
                À défaut de résolution amiable ou par médiation, les tribunaux du canton de [Votre canton],
                Suisse, seront seuls compétents.
              </p>
              <p className="mb-4">
                Le droit suisse est exclusivement applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Crédits et Technologies</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">9.1 Technologies Open Source</h3>
              <p className="mb-4">
                Medannot est développé avec les technologies suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                <li>React 18 (Meta Platforms, Inc.) - MIT License</li>
                <li>TypeScript (Microsoft Corporation) - Apache License 2.0</li>
                <li>Vite (Evan You) - MIT License</li>
                <li>TailwindCSS (Tailwind Labs Inc.) - MIT License</li>
                <li>Supabase (Supabase Inc.) - Apache License 2.0</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Nous remercions les communautés open source pour leur contribution inestimable.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">9.2 Services IA</h3>
              <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                <li>OpenAI Whisper (OpenAI Inc.) - Transcription vocale</li>
                <li>Anthropic Claude (Anthropic PBC) - Génération de texte assistée par IA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Accessibilité</h2>
              <p className="mb-4">
                Nous nous efforçons de rendre Medannot accessible au plus grand nombre, conformément
                aux standards WCAG 2.1 (Web Content Accessibility Guidelines).
              </p>
              <p className="mb-4">
                Si vous rencontrez des difficultés d'accessibilité, contactez-nous à :
                <strong className="ml-1">accessibility@medannot.ch</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Mise à Jour des Mentions Légales</h2>
              <p className="mb-4">
                Les présentes mentions légales peuvent être mises à jour pour refléter les évolutions
                de notre organisation ou de la législation.
              </p>
              <p className="mb-4">
                Date de dernière mise à jour : <strong>{new Date().toLocaleDateString("fr-CH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}</strong>
              </p>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <h2 className="text-2xl font-semibold mb-4">12. Nous Contacter</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Support Technique</h3>
                  <p className="text-sm">Email : support@medannot.ch</p>
                  <p className="text-sm">Horaires : Lun-Ven, 9h-17h (CET)</p>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Questions Juridiques</h3>
                  <p className="text-sm">Email : legal@medannot.ch</p>
                  <p className="text-sm">Délai de réponse : 5 jours ouvrables</p>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Protection des Données</h3>
                  <p className="text-sm">Email : dpo@medannot.ch</p>
                  <p className="text-sm">Pour exercer vos droits RGPD/LPD</p>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Contact Général</h3>
                  <p className="text-sm">Email : contact@medannot.ch</p>
                  <p className="text-sm">Adresse : [Votre adresse], Suisse</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
