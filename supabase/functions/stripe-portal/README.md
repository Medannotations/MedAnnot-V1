# Edge Function: Stripe Portal

Cette Edge Function crée un portail client Stripe permettant aux utilisateurs de gérer leur abonnement.

## Fonctionnalités

- Modifier les informations de paiement
- Changer de formule (mensuel → annuel)
- Résilier l'abonnement
- Voir l'historique des factures
- Télécharger les factures

## Déploiement

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter à Supabase
supabase login

# Déployer la fonction
supabase functions deploy stripe-portal

# Définir les secrets nécessaires
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Variables d'environnement requises

- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `SUPABASE_URL` : URL de votre projet Supabase (auto-défini)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé de service Supabase (auto-défini)

## Utilisation

```typescript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/stripe-portal`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify({ userId }),
  }
);

const { url } = await response.json();
window.location.href = url;
```

## Configuration Stripe requise

Dans votre Dashboard Stripe :
1. Activer le "Customer Portal" dans les paramètres
2. Configurer les produits/plans autorisés
3. Définir l'URL de retour

## Sécurité

- Vérification du JWT Supabase automatique
- Vérification que le user_id correspond bien au token
- Utilisation du service role key côté serveur uniquement
