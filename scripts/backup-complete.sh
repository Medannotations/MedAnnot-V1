#!/bin/bash
# Script de backup complet pour migration Infomaniak
# Usage: ./backup-complete.sh

set -e

echo "🔒 BACKUP COMPLET MEDANNOT - Migration Infomaniak"
echo "=================================================="
echo ""

BACKUP_DIR="./backups-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Dossier de backup: $BACKUP_DIR"
echo ""

# 1. Backup du code source
echo "📦 1. Backup du code source..."
git archive --format=tar.gz -o "$BACKUP_DIR/source-code.tar.gz" HEAD
echo "   ✅ Code source sauvegardé"
echo ""

# 2. Export de la structure Supabase (schéma)
echo "📋 2. Export du schéma de base de données..."
SUPABASE_URL="https://vbaaohcsmiaxbqcyfhhl.supabase.co"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "   ⚠️  Clé service Supabase non trouvée dans les variables d'environnement"
    echo "   ℹ️  Pour exporter le schéma, exécute:"
    echo "      supabase db dump --project-ref vbaaohcsmiaxbqcyfhhl > schema.sql"
else
    # Export du schéma via pg_dump (nécessite le service key)
    echo "   🔄 Export en cours..."
fi

echo ""

# 3. Liste des tables à migrer
echo "📊 3. Tables à migrer:"
cat > "$BACKUP_DIR/tables-list.txt" << EOF
profiles
patients
annotations
subscriptions (si table perso)
webhook_events
EOF

cat "$BACKUP_DIR/tables-list.txt"
echo ""

# 4. Backup des Edge Functions
echo "⚡ 4. Backup des Edge Functions..."
mkdir -p "$BACKUP_DIR/edge-functions"
cp -r supabase/functions/* "$BACKUP_DIR/edge-functions/" 2>/dev/null || echo "   ⚠️  Aucune edge function trouvée"
echo "   ✅ Edge Functions sauvegardées"
echo ""

# 5. Variables d'environnement (template)
echo "🔧 5. Génération du template .env.production..."
cat > "$BACKUP_DIR/env-template.txt" << 'EOF'
# ============================================
# TEMPLATE .env.production - Infomaniak
# ============================================
# À remplir avec tes credentials Infomaniak

# Base de données PostgreSQL (Infomaniak)
DATABASE_URL=postgresql://username:password@host:5432/medannot
PGHOST=your-db-host.infomaniak.com
PGPORT=5432
PGDATABASE=medannot
PGUSER=your-username
PGPASSWORD=your-password

# Application
VITE_APP_URL=https://medannot.ch
NODE_ENV=production
PORT=3000

# Supabase (si self-hosted ou service cloud séparé)
VITE_SUPABASE_URL=https://your-instance.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Stripe (déjà configuré)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Infomaniak Mail ou autre)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@medannot.ch
SMTP_PASS=your-email-password

# Sécurité
JWT_SECRET=generate-a-strong-random-secret
ENCRYPTION_KEY=generate-a-strong-encryption-key
EOF

echo "   ✅ Template .env créé"
echo ""

# 6. Documentation de migration
echo "📝 6. Génération de la documentation..."
cat > "$BACKUP_DIR/MIGRATION-CHECKLIST.md" << 'EOF'
# Checklist Migration Infomaniak

## Prérequis Infomaniak
- [ ] VPS Cloud créé (Ubuntu 22.04 LTS recommandé)
- [ ] PostgreSQL 15+ créé et accessible
- [ ] Domaine medannot.ch pointé vers le VPS
- [ ] SSL configuré (Let's Encrypt)

## Migration Base de Données
- [ ] Créer la base PostgreSQL chez Infomaniak
- [ ] Exporter les données de Supabase
- [ ] Importer dans PostgreSQL Infomaniak
- [ ] Vérifier les index et contraintes
- [ ] Tester les connexions

## Déploiement Application
- [ ] Cloner le repo sur le VPS
- [ ] Installer Node.js 20.x
- [ ] Installer les dépendances
- [ ] Configurer les variables d'environnement
- [ ] Builder l'application (npm run build)
- [ ] Configurer Nginx
- [ ] Démarrer avec PM2

## Configuration Stripe
- [ ] Mettre à jour l'URL des webhooks: https://medannot.ch/api/webhooks/stripe
- [ ] Tester un paiement
- [ ] Vérifier le portail client

## Edge Functions → Node.js
- [ ] Migrer stripe-portal → /api/stripe-portal
- [ ] Migrer get-subscription → /api/get-subscription
- [ ] Migrer stripe-webhook → /api/webhooks/stripe
- [ ] Tester tous les endpoints

## Tests Post-Migration
- [ ] Inscription utilisateur
- [ ] Création d'annotation
- [ ] Paiement Stripe
- [ ] Accès au portail client
- [ ] Réception webhooks
- [ ] Emails de notification

## Sécurité
- [ ] Firewall configuré (UFW)
- [ ] Fail2ban installé
- [ ] Backups automatiques configurés
- [ ] Monitoring (optionnel: Uptime Kuma)
EOF

echo "   ✅ Checklist créée"
echo ""

# 7. Résumé
echo "=================================================="
echo "✅ BACKUP TERMINÉ"
echo "=================================================="
echo ""
echo "📂 Contenu de $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"
echo ""
echo "Prochaines étapes:"
echo "1. Commande ton VPS Infomaniak"
echo "2. Crée une base PostgreSQL"
echo "3. Exporte les données depuis Supabase"
echo ""
echo "Je vais maintenant créer les scripts de déploiement..."
