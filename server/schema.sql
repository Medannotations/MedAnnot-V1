-- =====================================================
-- SCHEMA MEDANNOT - PostgreSQL
-- Pour migration Infomaniak
-- =====================================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUTH (remplace Supabase Auth)
-- =====================================================
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    email_confirmed_at TIMESTAMPTZ,
    confirmation_sent_at TIMESTAMPTZ,
    recovery_sent_at TIMESTAMPTZ,
    email_change_sent_at TIMESTAMPTZ,
    new_email VARCHAR(255),
    raw_app_meta_data JSONB DEFAULT '{}',
    raw_user_meta_data JSONB DEFAULT '{}',
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    phone VARCHAR(15) DEFAULT NULL,
    phone_confirmed_at TIMESTAMPTZ,
    phone_change VARCHAR(15) DEFAULT '',
    phone_change_token VARCHAR(255) DEFAULT '',
    phone_change_sent_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ GENERATED ALWAYS AS (
        LEAST(email_confirmed_at, phone_confirmed_at)
    ) STORED,
    email_change_token_current VARCHAR(255) DEFAULT '',
    email_change_confirm_status SMALLINT DEFAULT 0,
    banned_until TIMESTAMPTZ,
    reauthentication_token VARCHAR(255) DEFAULT '',
    reauthentication_sent_at TIMESTAMPTZ,
    is_sso_user BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

-- Index pour auth.users
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users USING btree (id);

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    subscription_status VARCHAR(50) DEFAULT 'none',
    subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    subscription_current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PATIENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Switzerland',
    notes TEXT,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patients_user_id_idx ON patients(user_id);
CREATE INDEX IF NOT EXISTS patients_name_idx ON patients(last_name, first_name);

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ANNOTATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    audio_url TEXT,
    transcription TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    vital_signs JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS annotations_user_id_idx ON annotations(user_id);
CREATE INDEX IF NOT EXISTS annotations_patient_id_idx ON annotations(patient_id);
CREATE INDEX IF NOT EXISTS annotations_created_at_idx ON annotations(created_at DESC);

CREATE TRIGGER update_annotations_updated_at 
    BEFORE UPDATE ON annotations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- WEBHOOK EVENTS (pour debug et replay)
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL, -- 'stripe', etc.
    event_type VARCHAR(255) NOT NULL,
    event_id VARCHAR(255) UNIQUE,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS webhook_events_source_idx ON webhook_events(source);
CREATE INDEX IF NOT EXISTS webhook_events_event_id_idx ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS webhook_events_processed_idx ON webhook_events(processed);

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour créer automatiquement un profil lors de la création d'un user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- POLITIQUES RLS (simulation avec vues ou contrôle applicatif)
-- Note: RLS n'est pas standard PostgreSQL, on gère ça dans l'app
-- =====================================================

-- Vue pour les patients de l'utilisateur courant
CREATE OR REPLACE VIEW user_patients AS
SELECT p.* 
FROM patients p
WHERE p.user_id = current_setting('app.current_user_id')::UUID;

-- Vue pour les annotations de l'utilisateur courant  
CREATE OR REPLACE VIEW user_annotations AS
SELECT a.* 
FROM annotations a
WHERE a.user_id = current_setting('app.current_user_id')::UUID;

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Créer un utilisateur admin (à modifier après installation)
-- Mot de passe: admin123 (à changer immédiatement!)
-- Hash bcrypt pour 'admin123': $2b$10$YourHashHere

-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, is_super_admin)
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'admin@medannot.ch',
--     '$2b$10$YourHashedPasswordHere',
--     NOW(),
--     TRUE
-- );

-- =====================================================
-- COMMENTAIRES
-- =====================================================
COMMENT ON TABLE auth.users IS 'Table d\'authentification (remplace Supabase Auth)';
COMMENT ON TABLE profiles IS 'Profils utilisateurs étendus';
COMMENT ON TABLE patients IS 'Patients des utilisateurs';
COMMENT ON TABLE annotations IS 'Annotations médicales';
COMMENT ON TABLE webhook_events IS 'Journal des webhooks reçus';

-- Fin du schema
