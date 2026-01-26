import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
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
            Conditions Générales d'Utilisation (CGU)
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
              <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
              <p className="mb-4">
                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation
                de la plateforme Medannot (ci-après "la Plateforme"), un service SaaS destiné aux infirmiers
                indépendants exerçant en Suisse pour la rédaction assistée d'annotations infirmières.
              </p>
              <p className="mb-4">
                L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
                Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Définitions</h2>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Utilisateur :</strong> Toute personne physique, infirmier indépendant, utilisant la Plateforme</li>
                <li><strong>Patient :</strong> Personne bénéficiaire des soins infirmiers dont les données sont traitées via la Plateforme</li>
                <li><strong>Annotation :</strong> Document professionnel rédigé par l'infirmier documentant une visite/soin</li>
                <li><strong>Transcription :</strong> Conversion automatique de l'enregistrement vocal en texte</li>
                <li><strong>Service :</strong> Ensemble des fonctionnalités proposées par Medannot</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Inscription et Compte Utilisateur</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Conditions d'Inscription</h3>
              <p className="mb-4">Pour utiliser la Plateforme, vous devez :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Être infirmier diplômé et autorisé à exercer en Suisse</li>
                <li>Être âgé d'au moins 18 ans</li>
                <li>Fournir des informations exactes et à jour lors de l'inscription</li>
                <li>Accepter les présentes CGU et la Politique de Confidentialité</li>
                <li>Souscrire à un abonnement payant actif</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Sécurité du Compte</h3>
              <p className="mb-4">Vous êtes responsable de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>La confidentialité de vos identifiants de connexion</li>
                <li>Toutes les activités effectuées depuis votre compte</li>
                <li>Notifier immédiatement Medannot de toute utilisation non autorisée</li>
                <li>Utiliser un mot de passe fort et unique</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Suspension ou Résiliation du Compte</h3>
              <p className="mb-4">Medannot se réserve le droit de suspendre ou résilier votre compte en cas de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Violation des présentes CGU</li>
                <li>Utilisation frauduleuse ou abusive du Service</li>
                <li>Non-paiement de l'abonnement</li>
                <li>Activité suspecte ou non conforme aux bonnes pratiques médicales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Description du Service</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Fonctionnalités</h3>
              <p className="mb-4">La Plateforme permet de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Gérer une base de données patients chiffrée</li>
                <li>Enregistrer des notes vocales lors des visites</li>
                <li>Transcrire automatiquement les enregistrements vocaux</li>
                <li>Générer des annotations infirmières structurées via IA</li>
                <li>Éditer et personnaliser les annotations</li>
                <li>Archiver et rechercher les annotations passées</li>
                <li>Exporter les données au format standard</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Intelligence Artificielle</h3>
              <p className="mb-4">
                Le Service utilise des technologies d'intelligence artificielle (Whisper, Claude) pour :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>La transcription vocale automatique</li>
                <li>La génération d'annotations structurées</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Responsabilité Médicale de l'Utilisateur
                </p>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  L'IA est un outil d'assistance uniquement. Vous restez pleinement responsable du contenu
                  médical final de vos annotations. Vous devez TOUJOURS réviser, valider et corriger le
                  contenu généré avant toute utilisation professionnelle ou transmission.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Obligations de l'Utilisateur</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Respect du Secret Professionnel</h3>
              <p className="mb-4">Vous vous engagez à :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Respecter le secret professionnel médical (art. 321 CP suisse)</li>
                <li>N'entrer que des données de patients dont vous avez la responsabilité</li>
                <li>Obtenir le consentement des patients pour le traitement informatisé de leurs données</li>
                <li>Ne pas partager vos identifiants avec des tiers</li>
                <li>Sécuriser votre appareil d'accès à la Plateforme</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Utilisation Conforme</h3>
              <p className="mb-4">Il est strictement interdit de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Utiliser le Service à des fins illégales ou non autorisées</li>
                <li>Tenter d'accéder aux données d'autres utilisateurs</li>
                <li>Introduire des virus, malwares ou codes malveillants</li>
                <li>Surcharger ou perturber l'infrastructure technique</li>
                <li>Extraire, copier ou revendre les données de la Plateforme</li>
                <li>Reverse-engineer ou tenter de décompiler le Service</li>
                <li>Utiliser des bots ou scripts automatisés non autorisés</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Exactitude des Informations</h3>
              <p className="mb-4">Vous garantissez que :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Les informations saisies sont exactes et complètes</li>
                <li>Vous vérifiez systématiquement le contenu généré par l'IA</li>
                <li>Vous corrigez toute erreur avant utilisation professionnelle</li>
                <li>Vous mettez à jour régulièrement les données patients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Propriété Intellectuelle</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Propriété de Medannot</h3>
              <p className="mb-4">Medannot conserve tous les droits sur :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Le code source de la Plateforme</li>
                <li>Les algorithmes et la technologie</li>
                <li>Le design, les logos et la marque "Medannot"</li>
                <li>La documentation et les ressources pédagogiques</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Vos Données</h3>
              <p className="mb-4">
                Vous conservez l'entière propriété de :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Toutes les données que vous saisissez</li>
                <li>Les annotations générées (même assistées par IA)</li>
                <li>Les enregistrements vocaux (avant suppression automatique)</li>
              </ul>
              <p className="mb-4 font-semibold">
                Medannot ne revendique AUCUN droit sur le contenu médical que vous créez.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disponibilité et Maintenance</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Objectif de Disponibilité</h3>
              <p className="mb-4">
                Nous nous efforçons de maintenir un taux de disponibilité de 99,5% hors maintenance planifiée.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Maintenance</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Maintenance planifiée : notification 48h à l'avance</li>
                <li>Maintenance d'urgence : sans préavis si nécessaire pour la sécurité</li>
                <li>Fenêtre préférentielle : heures nocturnes (01h00-05h00 CET)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Limitation de Responsabilité</h3>
              <p className="mb-4">Medannot ne pourra être tenu responsable en cas de :</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Interruption temporaire du Service pour maintenance</li>
                <li>Problèmes liés à votre connexion Internet</li>
                <li>Défaillance d'un sous-traitant (infrastructure, API tierces)</li>
                <li>Cas de force majeure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation de Responsabilité Médicale</h2>

              <div className="bg-destructive/10 border-2 border-destructive p-6 rounded-lg mb-4">
                <h3 className="font-bold text-destructive mb-3">CLAUSE ESSENTIELLE</h3>
                <p className="mb-4">
                  Medannot est un <strong>outil d'assistance administrative</strong> et ne constitue PAS :
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4 text-sm">
                  <li>Un dispositif médical au sens de la législation suisse</li>
                  <li>Un système expert médical</li>
                  <li>Un outil de diagnostic ou de prescription</li>
                  <li>Un substitut au jugement clinique de l'infirmier</li>
                </ul>
                <p className="font-semibold mt-4">
                  L'Utilisateur reste SEUL RESPONSABLE de :
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4 text-sm">
                  <li>L'exactitude du contenu médical final</li>
                  <li>Les décisions cliniques et thérapeutiques</li>
                  <li>La conformité aux protocoles et bonnes pratiques</li>
                  <li>La responsabilité professionnelle vis-à-vis des patients</li>
                </ul>
              </div>

              <p className="mb-4">
                Medannot ne pourra être tenu responsable :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Des erreurs médicales résultant d'une annotation non vérifiée</li>
                <li>Des conséquences d'une décision clinique basée sur le contenu généré</li>
                <li>De l'utilisation non conforme du Service</li>
                <li>Des litiges entre l'Utilisateur et ses patients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Données Personnelles</h2>
              <p className="mb-4">
                Le traitement de vos données personnelles et celles de vos patients est régi par notre
                <a href="/privacy-policy" className="text-primary hover:underline ml-1">
                  Politique de Confidentialité
                </a>, qui fait partie intégrante des présentes CGU.
              </p>
              <p className="mb-4">
                Points clés :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Chiffrement AES-256 de toutes les données patients</li>
                <li>Suppression immédiate des fichiers audio après transcription</li>
                <li>Zero data retention pour les API d'IA (Whisper, Claude)</li>
                <li>Hébergement exclusif en Suisse (Safe Swiss Cloud)</li>
                <li>Conformité LPD suisse et RGPD européen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Tarification et Paiement</h2>
              <p className="mb-4">
                Les conditions de paiement et d'abonnement sont détaillées dans nos
                <a href="/terms-of-sale" className="text-primary hover:underline ml-1">
                  Conditions Générales de Vente
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Résiliation</h2>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.1 Par l'Utilisateur</h3>
              <p className="mb-4">
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. La résiliation
                prend effet à la fin de la période de facturation en cours.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.2 Par Medannot</h3>
              <p className="mb-4">
                Medannot peut résilier immédiatement votre accès en cas de violation grave des CGU,
                notamment :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Utilisation frauduleuse</li>
                <li>Non-respect du secret médical</li>
                <li>Activité illégale</li>
                <li>Non-paiement prolongé</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">11.3 Conséquences de la Résiliation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Accès immédiat suspendu</li>
                <li>Délai de grâce de 30 jours pour exporter vos données</li>
                <li>Suppression définitive des données après 30 jours</li>
                <li>Aucun remboursement des sommes déjà payées (sauf droit de rétractation légal)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Modifications des CGU</h2>
              <p className="mb-4">
                Medannot se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
                substantielles vous seront notifiées par email au moins 30 jours avant leur entrée en vigueur.
              </p>
              <p className="mb-4">
                La poursuite de l'utilisation du Service après l'entrée en vigueur des nouvelles CGU vaut
                acceptation de celles-ci.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Droit Applicable et Juridiction</h2>
              <p className="mb-4">
                Les présentes CGU sont régies par le droit suisse.
              </p>
              <p className="mb-4">
                Tout litige relatif à l'interprétation, l'exécution ou la résiliation des présentes CGU
                sera soumis à la compétence exclusive des tribunaux du canton de [Votre canton], Suisse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
              <div className="bg-muted p-6 rounded-lg">
                <p>Pour toute question concernant ces CGU :</p>
                <p className="mt-2">
                  <strong>Email :</strong> legal@medannot.ch<br />
                  <strong>Adresse :</strong> [Votre adresse]<br />
                  Suisse
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                En utilisant Medannot, vous reconnaissez avoir lu, compris et accepté les présentes
                Conditions Générales d'Utilisation dans leur intégralité.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
