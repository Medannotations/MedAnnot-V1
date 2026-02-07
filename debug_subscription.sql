-- =============================================================================
-- DEBUG & FIX SUBSCRIPTION WEBHOOK ISSUES
-- =============================================================================

-- 1. VÉRIFIER LA STRUCTURE DE LA TABLE
-- =============================================================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('subscription_status', 'subscription_current_period_end', 'stripe_customer_id', 'email', 'user_id')
ORDER BY column_name;

-- 2. VÉRIFIER LES UTILISATEURS SANS SUBSCRIPTION
-- =============================================================================
SELECT 
  email, 
  user_id, 
  subscription_status,
  stripe_customer_id,
  created_at
FROM profiles 
WHERE subscription_status IS NULL 
   OR subscription_status = 'none'
ORDER BY created_at DESC
LIMIT 10;

-- 3. VÉRIFIER UN UTILISATEUR SPÉCIFIQUE (remplacez l'email)
-- =============================================================================
-- SELECT * FROM profiles WHERE email = 'votre-email@exemple.com';

-- 4. FORCER L'ACTIVATION D'UN ABONNEMENT (manuellement)
-- =============================================================================
-- Décommentez et modifiez pour activer manuellement :
/*
UPDATE profiles 
SET 
  subscription_status = 'active',
  subscription_current_period_end = (NOW() + INTERVAL '30 days')::timestamptz,
  updated_at = NOW()
WHERE email = 'email-utilisateur@exemple.com'
RETURNING email, subscription_status, subscription_current_period_end;
*/

-- 5. CRÉER UN INDEX POUR ACCÉLÉRER LA RECHERCHE PAR EMAIL
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON profiles(LOWER(email));

-- 6. VÉRIFIER LES RLS POLICIES
-- =============================================================================
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 7. AJOUTER UNE POLICY POUR PERMETTRE AU SERVICE_ROLE DE MODIFIER
-- =============================================================================
-- Si le webhook utilise service_role, cette policy n'est pas nécessaire
-- mais vérifiez qu'il n'y a pas de restriction qui bloque

-- 8. STATISTIQUES DES ABONNEMENTS
-- =============================================================================
SELECT 
  subscription_status,
  COUNT(*) as count
FROM profiles
GROUP BY subscription_status;

-- 9. VÉRIFIER SI LES WEBHOOKS ONT ÉTÉ REÇUS (nécessite une table de logs)
-- =============================================================================
-- Si vous avez une table webhook_logs :
-- SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;

-- 10. RÉPARER LES UTILISATEURS AVEC DES DATES INVALIDES
-- =============================================================================
-- Met à jour les utilisateurs dont la date de fin est passée
/*
UPDATE profiles 
SET 
  subscription_status = 'canceled',
  updated_at = NOW()
WHERE subscription_current_period_end < NOW()
AND subscription_status = 'active';
*/
