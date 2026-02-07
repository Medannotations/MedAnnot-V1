# 🔧 Fix Portail Stripe - Erreur "Impossible d'accéder au portail"

## Cause probable

La fonction ne trouve pas `stripe_customer_id` dans le profil utilisateur, ou la variable `STRIPE_SECRET_KEY` n'est pas configurée.

## Vérifications

### 1. Vérifier STRIPE_SECRET_KEY

Dans Supabase Dashboard → Project Settings → Functions → Secrets :

Assurez-vous d'avoir :
- ✅ `STRIPE_SECRET_KEY` = `sk_live_...` ou `sk_test_...` (clé secrète, pas la publishable key)

**Où la trouver :**
- Stripe Dashboard → Developers → API keys → Secret key

### 2. Vérifier que l'utilisateur a un stripe_customer_id

Dans Supabase SQL Editor :
```sql
SELECT email, stripe_customer_id, subscription_status 
FROM profiles 
WHERE user_id = 'VOTRE_USER_ID';
```

Si `stripe_customer_id` est NULL, la fonction va maintenant le créer automatiquement.

### 3. Forcer la création d'un customer Stripe (si nécessaire)

```sql
-- Mettre à jour manuellement (remplacez par vos vraies valeurs)
UPDATE profiles 
SET 
  stripe_customer_id = 'cus_...',
  subscription_status = 'active',
  updated_at = NOW()
WHERE email = 'votre-email@exemple.com';
```

## Test après fix

1. Allez sur la page "Mon compte" → Abonnement
2. Cliquez sur "Gérer mon abonnement"
3. Le portail Stripe devrait s'ouvrir

## Si ça ne marche toujours pas

Vérifiez les logs :
https://supabase.com/dashboard/project/vbaaohcsmiaxbqcyfhhl/functions/stripe-portal/logs

Messages à chercher :
- `Environment check: {hasSupabaseUrl: true, ...}` - Doit avoir les 3 à true
- `Profile lookup result: {found: true, ...}` - Doit trouver le profil
- `Created and saved Stripe customer: cus_...` - Si un nouveau customer est créé
- `Portal session created:bps_...` - Si la session est créée

## Configuration complète des secrets Stripe

Dans Supabase Dashboard, vous devez avoir :

| Secret | Valeur | Description |
|--------|--------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` ou `sk_test_...` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Secret du webhook |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | Service role key |
| `SUPABASE_URL` | `https://...` | URL Supabase |

## Créer un customer Stripe manuellement

Si vous voulez créer un customer pour un utilisateur existant :

1. Allez sur Stripe Dashboard → Customers
2. Cliquez "Add customer"
3. Mettez l'email de l'utilisateur
4. Dans metadata, ajoutez : `userId` = `uuid-de-l-utilisateur`
5. Copiez l'ID du customer (commence par `cus_`)
6. Dans Supabase SQL Editor :
   ```sql
   UPDATE profiles 
   SET stripe_customer_id = 'cus_...' 
   WHERE email = 'email-utilisateur@exemple.com';
   ```
