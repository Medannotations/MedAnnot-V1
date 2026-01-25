-- Ajouter les colonnes de paiement à la table users
-- Ces colonnes stockent les informations d'abonnement Stripe pour chaque utilisateur

ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Créer un index pour trouver rapidement un utilisateur par son ID client Stripe
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx
ON users(stripe_customer_id);

-- Ajouter les RLS (Row Level Security) pour sécuriser les données
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que leurs propres données
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);
