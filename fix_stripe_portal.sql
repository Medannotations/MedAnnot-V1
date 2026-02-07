-- =============================================================================
-- FIX PORTAIL STRIPE - Diagnostic et correction
-- =============================================================================

-- 1. VÉRIFIER TOUS LES SECRETS REQUIS
-- =============================================================================
-- Dans Supabase Dashboard → Settings → Functions, vérifiez :
-- - STRIPE_SECRET_KEY (sk_live_... ou sk_test_...)
-- - STRIPE_WEBHOOK_SECRET (whsec_...)
-- - SUPABASE_SERVICE_ROLE_KEY
-- - SUPABASE_URL

-- 2. VÉRIFIER LES UTILISATEURS SANS STRIPE_CUSTOMER_ID
-- =============================================================================
SELECT 
  id,
  email,
  user_id,
  stripe_customer_id,
  subscription_status,
  created_at
FROM profiles 
WHERE stripe_customer_id IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- 3. DIAGNOSTIC POUR UN UTILISATEUR SPÉCIFIQUE
-- Remplacez 'votre-email@exemple.com' par l'email de l'utilisateur
-- =============================================================================
/*
SELECT 
  email,
  user_id,
  stripe_customer_id,
  subscription_status,
  subscription_current_period_end
FROM profiles 
WHERE LOWER(email) = LOWER('votre-email@exemple.com');
*/

-- 4. FORCER L'AJOUT D'UN CUSTOMER STRIPE (manuellement)
-- Remplacez les valeurs ci-dessous
-- =============================================================================
/*
UPDATE profiles 
SET 
  stripe_customer_id = 'cus_...',  -- Remplacez par l'ID Stripe
  subscription_status = 'active',
  updated_at = NOW()
WHERE email = 'email-utilisateur@exemple.com'
RETURNING email, stripe_customer_id, subscription_status;
*/

-- 5. CRÉER TOUS LES CUSTOMERS MANQUANTS (à exécuter avec précaution)
-- Cela liste tous les utilisateurs actifs sans customer_id
-- =============================================================================
SELECT 
  p.email,
  p.user_id,
  'Créer customer Stripe et mettre à jour' as action_requise
FROM profiles p
WHERE p.stripe_customer_id IS NULL
  AND (p.subscription_status = 'active' OR p.subscription_status = 'trialing')
ORDER BY p.created_at DESC;

-- 6. VÉRIFIER L'INDEX SUR EMAIL (accélère la recherche)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON profiles(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;

-- 7. STATISTIQUES DES CUSTOMERS
-- =============================================================================
SELECT 
  CASE 
    WHEN stripe_customer_id IS NOT NULL THEN 'Avec Stripe'
    ELSE 'Sans Stripe'
  END as statut,
  COUNT(*) as nombre,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as pourcentage
FROM profiles
GROUP BY stripe_customer_id IS NOT NULL;

-- 8. RÉINITIALISER UN CUSTOMER (si problème)
-- =============================================================================
/*
UPDATE profiles 
SET 
  stripe_customer_id = NULL,
  subscription_status = 'none',
  updated_at = NOW()
WHERE email = 'email-probleme@exemple.com';
*/

-- 9. VÉRIFIER LES DOUBLONS DE CUSTOMER_ID
-- =============================================================================
SELECT stripe_customer_id, COUNT(*) as occurrences
FROM profiles 
WHERE stripe_customer_id IS NOT NULL
GROUP BY stripe_customer_id 
HAVING COUNT(*) > 1;
