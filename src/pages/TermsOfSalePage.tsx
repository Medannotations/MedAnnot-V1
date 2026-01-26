import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TermsOfSalePage() {
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
            Conditions Générales de Vente (CGV)
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
              <h2 className="text-2xl font-semibold mb-4">1. Dispositions Générales</h2>
              <p className="mb-4">
                Les présentes Conditions Générales de Vente (ci-après "CGV") s'appliquent à toute souscription
                d'abonnement au service Medannot proposé par [Votre raison sociale], entreprise suisse enregistrée
                sous le numéro IDE [Votre numéro IDE].
              </p>
              <p className="mb-4">
                L'achat d'un abonnement implique l'acceptation sans réserve des présentes CGV ainsi que des
                <a href="/terms-of-service" className="text-primary hover:underline ml-1">
                  Conditions Générales d'Utilisation
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Offres et Prix</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Formules d'Abonnement</h3>
              <p className="mb-4">
                Medannot propose les formules d'abonnement suivantes :
              </p>
              <div className="bg-muted p-6 rounded-lg space-y-4 mb-4">
                <div>
                  <p className="font-semibold text-lg">Formule Mensuelle</p>
                  <p className="text-sm text-muted-foreground">CHF 29.- / mois (TVA incluse)</p>
                  <p className="text-sm">Engagement sans durée minimale, résiliable à tout moment</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-lg">Formule Annuelle</p>
                  <p className="text-sm text-muted-foreground">CHF 290.- / an (TVA incluse)</p>
                  <p className="text-sm">Soit CHF 24.17/mois - Économie de 17% par rapport à la formule mensuelle</p>
                  <p className="text-sm mt-1">Engagement 12 mois, paiement en une fois</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Tarification</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Prix affichés en Francs Suisses (CHF)</li>
                <li>TVA suisse à 8,1% incluse dans tous les prix</li>
                <li>Aucun frais caché ou supplément</li>
                <li>Pas de limitation du nombre d'annotations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Modifications Tarifaires</h3>
              <p className="mb-4">
                Medannot se réserve le droit de modifier ses tarifs à tout moment. Toute modification
                tarifaire sera notifiée par email au moins 30 jours avant son application.
              </p>
              <p className="mb-4">
                Les tarifs en vigueur au moment de la souscription restent garantis pendant toute la
                durée de l'abonnement en cours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Souscription et Paiement</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Processus de Souscription</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Création d'un compte utilisateur sur la plateforme</li>
                <li>Sélection de la formule d'abonnement souhaitée</li>
                <li>Saisie des informations de paiement via Stripe (processeur sécurisé)</li>
                <li>Validation du paiement</li>
                <li>Accès immédiat au service activé</li>
              </ol>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Moyens de Paiement</h3>
              <p className="mb-4">Les paiements sont acceptés par :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
                <li>Cartes de débit</li>
                <li>TWINT (via Stripe)</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Les paiements sont traités de manière sécurisée par Stripe. Medannot ne stocke jamais
                les informations de carte bancaire.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Facturation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Mensuel :</strong> Prélèvement automatique le même jour chaque mois</li>
                <li><strong>Annuel :</strong> Prélèvement en une fois à la souscription, puis renouvellement annuel</li>
                <li>Facture envoyée par email après chaque paiement</li>
                <li>Facture conforme aux exigences TVA suisse</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Échec de Paiement</h3>
              <p className="mb-4">En cas de rejet de paiement :</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Notification par email immédiate</li>
                <li>Nouvelle tentative automatique après 3 jours</li>
                <li>Suspension du compte après 7 jours d'impayé</li>
                <li>Suppression des données après 30 jours d'impayé</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Droit de Rétractation</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Délai Légal</h3>
              <p className="mb-4">
                Conformément à la législation suisse sur la protection des consommateurs, vous disposez
                d'un délai de <strong>14 jours calendaires</strong> à compter de la souscription pour
                exercer votre droit de rétractation, sans avoir à justifier de motif.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Modalités d'Exercice</h3>
              <p className="mb-4">Pour exercer ce droit, adressez-nous une demande claire par :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Email à : <strong>refund@medannot.ch</strong></li>
                <li>Formulaire de contact sur la plateforme</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Remboursement</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Remboursement intégral sous 14 jours</li>
                <li>Même moyen de paiement que l'achat initial</li>
                <li>Accès au service immédiatement suspendu</li>
                <li>Données exportables pendant 7 jours après rétractation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Exception</h3>
              <p className="mb-4">
                Le droit de rétractation ne peut être exercé si vous avez expressément demandé
                l'exécution immédiate du service et reconnu perdre votre droit de rétractation
                en cas d'utilisation intensive (création de plus de 50 annotations).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Renouvellement et Résiliation</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Renouvellement Automatique</h3>
              <p className="mb-4">
                Les abonnements sont <strong>renouvelés automatiquement</strong> à leur échéance :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Mensuel :</strong> Renouvellement chaque mois, même date</li>
                <li><strong>Annuel :</strong> Renouvellement chaque année, même date</li>
              </ul>
              <p className="mb-4">
                Vous serez notifié par email 7 jours avant chaque renouvellement.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Résiliation</h3>
              <p className="mb-4">Vous pouvez résilier votre abonnement à tout moment :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Depuis votre espace client (section "Abonnement")</li>
                <li>Via le portail client Stripe</li>
                <li>Par email à support@medannot.ch</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Effets de la Résiliation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Mensuel :</strong> Accès maintenu jusqu'à la fin de la période payée</li>
                <li><strong>Annuel :</strong> Accès maintenu jusqu'à la date anniversaire</li>
                <li><strong>Aucun remboursement</strong> au prorata pour les périodes non utilisées (sauf droit de rétractation)</li>
                <li>Exportation des données possible pendant 30 jours après expiration</li>
                <li>Suppression définitive des données 30 jours après expiration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Garanties et Responsabilité</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Garantie de Service</h3>
              <p className="mb-4">Medannot s'engage à :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Fournir un service conforme à la description</li>
                <li>Maintenir un taux de disponibilité de 99,5% (hors maintenance)</li>
                <li>Assurer la sécurité et la confidentialité des données</li>
                <li>Fournir un support technique réactif</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Limitation de Responsabilité</h3>
              <p className="mb-4">
                Medannot ne pourra être tenu responsable :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Des dommages indirects (perte d'exploitation, manque à gagner)</li>
                <li>Des erreurs médicales résultant d'une mauvaise utilisation</li>
                <li>Des problèmes liés à votre équipement ou connexion Internet</li>
                <li>Des interruptions causées par un cas de force majeure</li>
              </ul>
              <p className="mb-4">
                En tout état de cause, la responsabilité de Medannot est limitée au montant de
                l'abonnement annuel du client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Support Client</h2>

              <div className="bg-muted p-6 rounded-lg mb-4">
                <h3 className="font-semibold mb-3">Canaux de Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Email :</strong> support@medannot.ch</li>
                  <li><strong>Horaires :</strong> Lundi-Vendredi, 9h00-17h00 (CET)</li>
                  <li><strong>Délai de réponse :</strong> 24-48h ouvrables</li>
                  <li><strong>Documentation :</strong> Base de connaissances en ligne</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. TVA et Facturation</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.1 TVA Suisse</h3>
              <p className="mb-4">
                Tous les prix incluent la TVA suisse au taux en vigueur (actuellement 8,1%).
              </p>
              <p className="mb-4">
                Numéro de TVA Medannot : <strong>CHE-[Votre numéro TVA]</strong>
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Factures</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facture PDF envoyée par email après chaque paiement</li>
                <li>Accès à l'historique des factures dans votre espace client</li>
                <li>Facture conforme aux exigences légales suisses</li>
                <li>Conservation des factures pendant 10 ans (obligation légale)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Propriété des Données</h2>
              <p className="mb-4">
                Conformément à notre <a href="/privacy-policy" className="text-primary hover:underline">
                  Politique de Confidentialité
                </a> :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Vous conservez l'entière propriété de vos données</li>
                <li>Droit d'exportation à tout moment au format standard (JSON/PDF)</li>
                <li>Droit de suppression définitive sur simple demande</li>
                <li>Aucun droit de rétention en cas d'impayé (exportation permise pendant 30 jours)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Modification des CGV</h2>
              <p className="mb-4">
                Medannot se réserve le droit de modifier les présentes CGV. Les modifications vous
                seront notifiées par email au moins 30 jours avant leur entrée en vigueur.
              </p>
              <p className="mb-4">
                Les nouvelles CGV s'appliqueront au prochain renouvellement de votre abonnement.
                Si vous n'acceptez pas les nouvelles conditions, vous pouvez résilier votre abonnement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Droit Applicable et Litiges</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.1 Droit Applicable</h3>
              <p className="mb-4">
                Les présentes CGV sont régies par le droit suisse.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.2 Médiation</h3>
              <p className="mb-4">
                En cas de litige, nous privilégions une résolution amiable. Vous pouvez contacter
                notre service client à : <strong>legal@medannot.ch</strong>
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.3 Juridiction</h3>
              <p className="mb-4">
                À défaut de résolution amiable, tout litige sera soumis à la compétence exclusive
                des tribunaux du canton de [Votre canton], Suisse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Informations Légales de l'Entreprise</h2>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>Raison sociale :</strong> [Votre raison sociale]</p>
                <p><strong>Forme juridique :</strong> [Sàrl / SA / Raison individuelle]</p>
                <p><strong>Siège social :</strong> [Votre adresse complète], Suisse</p>
                <p><strong>Numéro IDE :</strong> CHE-[Votre numéro IDE]</p>
                <p><strong>Numéro TVA :</strong> CHE-[Votre numéro TVA].MWST</p>
                <p><strong>Email :</strong> contact@medannot.ch</p>
                <p><strong>Représentant légal :</strong> [Nom du directeur]</p>
              </div>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                En souscrivant un abonnement Medannot, vous reconnaissez avoir lu, compris et accepté
                les présentes Conditions Générales de Vente dans leur intégralité.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
