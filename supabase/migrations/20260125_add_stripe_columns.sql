-- Ajouter les colonnes de paiement à la table profiles
-- Ces colonnes stockent les informations d'abonnement Stripe pour chaque utilisateur

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Créer un index pour trouver rapidement un utilisateur par son ID client Stripe
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
ON profiles(stripe_customer_id);

-- Note: RLS déjà activé sur profiles, pas besoin de le réactiver
