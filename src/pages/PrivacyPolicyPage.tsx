import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
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
            Politique de Confidentialité
          </h1>
          <p className="text-muted-foreground mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-CH", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Medannot ("nous", "notre", "nos") s'engage à protéger la confidentialité et la sécurité
                des données de santé de nos utilisateurs, conformément aux exigences les plus strictes du
                secret médical et de la législation suisse en matière de protection des données.
              </p>
              <p className="mb-4">
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons
                et protégeons vos informations personnelles et les données de santé de vos patients, en
                conformité avec :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>La Loi fédérale sur la protection des données (LPD) suisse</li>
                <li>Le Règlement Général sur la Protection des Données (RGPD) européen</li>
                <li>Le Code pénal suisse concernant le secret professionnel médical (art. 321)</li>
                <li>Les normes ISO 27001 pour la sécurité de l'information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Responsable du Traitement</h2>
              <p className="mb-4">
                Le responsable du traitement de vos données personnelles est :
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Medannot</strong></p>
                <p>Adresse : [Votre adresse en Suisse]</p>
                <p>Email : contact@medannot.ch</p>
                <p>Pays : Suisse</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Données Collectées</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Données de l'Utilisateur (Infirmier)</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Nom complet</li>
                <li>Adresse email</li>
                <li>Informations de paiement (via Stripe, jamais stockées sur nos serveurs)</li>
                <li>Préférences de configuration (structure d'annotation, exemples)</li>
                <li>Métadonnées d'utilisation (dates de connexion, fonctionnalités utilisées)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Données de Santé des Patients</h3>
              <p className="mb-4">
                <strong className="text-destructive">IMPORTANT :</strong> Toutes les données patients
                sont considérées comme des données de santé hautement sensibles et bénéficient du niveau
                de protection maximal.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Identité du patient (nom, prénom) - <strong>chiffrée AES-256</strong></li>
                <li>Adresse postale - <strong>chiffrée AES-256</strong></li>
                <li>Pathologies et antécédents médicaux - <strong>chiffrés AES-256</strong></li>
                <li>Notes cliniques - <strong>chiffrées AES-256</strong></li>
                <li>Annotations infirmières (contenu des visites) - <strong>chiffrées AES-256</strong></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Utilisation des Données</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Finalités du Traitement</h3>
              <p className="mb-4">Vos données sont utilisées uniquement pour :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Fournir le service de rédaction automatisée d'annotations infirmières</li>
                <li>Gérer votre compte utilisateur et votre abonnement</li>
                <li>Assurer la sécurité et l'intégrité de la plateforme</li>
                <li>Respecter nos obligations légales et réglementaires</li>
                <li>Améliorer la qualité du service (de manière anonymisée et agrégée)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Base Légale du Traitement</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Exécution du contrat :</strong> Le traitement est nécessaire pour fournir le service que vous avez souscrit</li>
                <li><strong>Obligation légale :</strong> Conservation des données pour conformité fiscale et comptable</li>
                <li><strong>Intérêt légitime :</strong> Sécurité de la plateforme et prévention de la fraude</li>
                <li><strong>Consentement :</strong> Pour l'utilisation de cookies non essentiels et communications marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Mesures de Sécurité Techniques</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Chiffrement des Données</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Chiffrement au repos :</strong> Toutes les données patients sont chiffrées avec AES-256-GCM avant stockage</li>
                <li><strong>Chiffrement en transit :</strong> Tous les échanges utilisent HTTPS/TLS 1.3</li>
                <li><strong>Clés de chiffrement :</strong> Dérivées de manière unique pour chaque utilisateur via PBKDF2 (100,000 itérations)</li>
                <li><strong>Déchiffrement :</strong> Les données ne sont déchiffrées que côté client, au moment de l'affichage</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Protection des Données Temporaires</h3>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Politique "Zéro Rétention" des Données Vocales
                </p>
                <ul className="list-disc pl-6 space-y-2 text-green-800 dark:text-green-200">
                  <li><strong>Enregistrements audio :</strong> JAMAIS stockés sur nos serveurs. Traités en mémoire puis immédiatement supprimés après transcription</li>
                  <li><strong>Transcriptions :</strong> Transmises aux API d'IA puis supprimées après génération de l'annotation</li>
                  <li><strong>API OpenAI Whisper :</strong> Configuration "zero data retention" activée</li>
                  <li><strong>API Anthropic Claude :</strong> Configuration "zero data retention" activée</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Infrastructure Hébergement</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Hébergement :</strong> Safe Swiss Cloud (infrastructure suisse certifiée)</li>
                <li><strong>Localisation :</strong> Serveurs situés exclusivement en Suisse</li>
                <li><strong>Certifications :</strong> ISO 27001, Finma-conforme, LPD-conforme</li>
                <li><strong>Sauvegardes :</strong> Chiffrées et stockées en Suisse uniquement</li>
                <li><strong>Accès physique :</strong> Datacenters sécurisés avec contrôle d'accès biométrique</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.4 Contrôles d'Accès</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Authentification multi-facteurs disponible</li>
                <li>Isolation des données par utilisateur (Row Level Security)</li>
                <li>Logs d'audit pour toute action sensible</li>
                <li>Surveillance continue des accès anormaux</li>
                <li>Sessions avec expiration automatique</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Partage des Données</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Sous-Traitants</h3>
              <p className="mb-4">Nous travaillons avec les sous-traitants suivants, tous soumis à des accords de confidentialité stricts :</p>
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <div>
                  <p className="font-semibold">Safe Swiss Cloud</p>
                  <p className="text-sm text-muted-foreground">Hébergement des données | Localisation : Suisse | Certification ISO 27001</p>
                </div>
                <div>
                  <p className="font-semibold">OpenAI (Whisper API)</p>
                  <p className="text-sm text-muted-foreground">Transcription vocale | Zero data retention activé | Données supprimées immédiatement</p>
                </div>
                <div>
                  <p className="font-semibold">Anthropic (Claude API)</p>
                  <p className="text-sm text-muted-foreground">Génération d'annotations | Zero data retention activé | Données supprimées immédiatement</p>
                </div>
                <div>
                  <p className="font-semibold">Stripe</p>
                  <p className="text-sm text-muted-foreground">Traitement des paiements | Localisation : UE | Conformité PCI-DSS</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Garanties Contractuelles</h3>
              <p className="mb-4">Tous nos sous-traitants sont contractuellement tenus de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Ne pas conserver les données au-delà du traitement immédiat</li>
                <li>Appliquer des mesures de sécurité équivalentes aux nôtres</li>
                <li>Ne pas utiliser les données pour leurs propres fins</li>
                <li>Notifier tout incident de sécurité dans les 24 heures</li>
                <li>Se conformer à la LPD suisse et au RGPD européen</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Aucun Transfert Commercial</h3>
              <p className="mb-4 font-semibold text-destructive">
                Nous ne vendons, ne louons ni ne partageons JAMAIS vos données ou celles de vos patients
                à des tiers à des fins commerciales ou marketing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Conservation des Données</h2>

              <table className="w-full border-collapse border border-border mb-4">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Type de donnée</th>
                    <th className="border border-border p-3 text-left">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">Compte utilisateur actif</td>
                    <td className="border border-border p-3">Durée de l'abonnement + 30 jours</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Données patients et annotations</td>
                    <td className="border border-border p-3">Jusqu'à suppression manuelle par l'utilisateur</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Fichiers audio</td>
                    <td className="border border-border p-3 font-semibold text-green-700 dark:text-green-400">0 seconde - Jamais stockés</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Transcriptions temporaires</td>
                    <td className="border border-border p-3 font-semibold text-green-700 dark:text-green-400">Supprimées après génération de l'annotation</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Données de facturation</td>
                    <td className="border border-border p-3">10 ans (obligation légale comptable)</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">Logs de sécurité</td>
                    <td className="border border-border p-3">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Vos Droits</h2>
              <p className="mb-4">Conformément à la LPD suisse et au RGPD, vous disposez des droits suivants :</p>

              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit d'accès</h4>
                  <p className="text-sm">Obtenir une copie de toutes vos données personnelles</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit de rectification</h4>
                  <p className="text-sm">Corriger les données inexactes ou incomplètes</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit à l'effacement ("droit à l'oubli")</h4>
                  <p className="text-sm">Demander la suppression définitive de vos données</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit à la portabilité</h4>
                  <p className="text-sm">Recevoir vos données dans un format structuré et couramment utilisé (JSON/CSV)</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit d'opposition</h4>
                  <p className="text-sm">Vous opposer au traitement de vos données à des fins de marketing</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Droit de limitation</h4>
                  <p className="text-sm">Demander la limitation du traitement dans certains cas</p>
                </div>
              </div>

              <p className="mt-6 mb-4">
                Pour exercer vos droits, contactez-nous à : <strong>privacy@medannot.ch</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Nous nous engageons à répondre à toute demande dans un délai de 30 jours maximum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Notifications de Violations</h2>
              <p className="mb-4">
                En cas de violation de données personnelles susceptible d'engendrer un risque pour vos
                droits et libertés, nous nous engageons à :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Notifier le Préposé fédéral à la protection des données (PFPDT) dans les 72 heures</li>
                <li>Vous informer directement par email dans les plus brefs délais</li>
                <li>Décrire la nature de la violation et les mesures prises</li>
                <li>Fournir des recommandations pour limiter les impacts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Cookies et Technologies Similaires</h2>
              <p className="mb-4">Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du service :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Cookies de session :</strong> Authentification et maintien de la session utilisateur</li>
                <li><strong>Cookies de sécurité :</strong> Protection contre les attaques CSRF</li>
                <li><strong>Cookies de préférence :</strong> Sauvegarde de vos paramètres d'interface</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Aucun cookie de tracking, publicité ou analyse tierce n'est utilisé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Modifications de la Politique</h2>
              <p className="mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité pour refléter les évolutions
                de nos pratiques ou de la législation. Toute modification substantielle vous sera notifiée
                par email au moins 30 jours avant son entrée en vigueur.
              </p>
              <p className="mb-4">
                La version en vigueur est toujours disponible sur notre site avec la date de dernière mise à jour.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact et Réclamations</h2>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Délégué à la Protection des Données (DPO)</h3>
                <p>Email : <strong>dpo@medannot.ch</strong></p>
                <p>Adresse : [Votre adresse]</p>

                <h3 className="font-semibold mb-4 mt-6">Autorité de Contrôle</h3>
                <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de :</p>
                <p className="mt-2">
                  <strong>Préposé fédéral à la protection des données et à la transparence (PFPDT)</strong><br />
                  Feldeggweg 1<br />
                  CH-3003 Berne<br />
                  Suisse<br />
                  <a href="https://www.edoeb.admin.ch" className="text-primary hover:underline">www.edoeb.admin.ch</a>
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                Cette politique de confidentialité est régie par le droit suisse. Tout litige relatif à
                l'interprétation ou à l'exécution de cette politique sera soumis aux tribunaux compétents
                du canton de [Votre canton], Suisse.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
