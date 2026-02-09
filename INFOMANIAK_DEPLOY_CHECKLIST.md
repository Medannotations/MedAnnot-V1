# ✅ CHECKLIST DÉPLOIEMENT INFOMANIAK

## 🎯 Ce que tu as commandé
- ✅ VPS Cloud Infomaniak
- ✅ PostgreSQL Cloud Infomaniak  
- ✅ Domaine medannot.ch (déjà possédé)

## 📦 Ce qui est prêt dans le code

### Backend (`server/`)
- ✅ `server/index.js` - API Express complète
- ✅ Auth JWT maison (login/register)
- ✅ CRUD Patients
- ✅ CRUD Annotations
- ✅ Stripe (portail, webhooks, abonnements)
- ✅ Chiffrement des données médicales

### Frontend (modifié)
- ✅ `src/services/api.ts` - Client API
- ✅ `src/contexts/AuthContext.tsx` - Auth sans Supabase
- ✅ `src/hooks/usePatients.ts` - API maison
- ✅ `src/hooks/useAnnotations.ts` - API maison
- ✅ `src/components/settings/SubscriptionSettings.tsx` - API maison
- ✅ `src/components/settings/CancellationDialogSimple.tsx` - API maison
- ✅ `src/components/subscription/CancelledBanner.tsx` - API maison

### Scripts d'automatisation
- ✅ `scripts/setup-vps.sh` - Setup automatique du VPS
- ✅ `scripts/deploy-infomaniak.sh` - Déploiement continu
- ✅ `scripts/backup-complete.sh` - Backup des données

## 🚀 PLAN DE DÉPLOIEMENT

### Phase 1: Recevoir les accès Infomaniak (1-2h)
- [ ] Email de confirmation VPS reçu avec IP
- [ ] Email PostgreSQL reçu avec credentials
- [ ] Accès SSH testé: `ssh root@<IP>`

### Phase 2: Setup VPS (15 min)
```bash
# Sur le VPS
ssh root@<IP-VPS>

# Télécharger et lancer le setup automatique
curl -fsSL https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-vps.sh | bash

# Suivre les instructions (domaine: medannot.ch)
```

### Phase 3: Configurer PostgreSQL (10 min)
```bash
# Se connecter à PostgreSQL Infomaniak (cloud)
psql "postgresql://user:pass@host.postgresql.infomaniak.ch:5432/medannot"

# Importer le schéma
\i server/schema.sql

# Vérifier
\dt
\q
```

### Phase 4: Déployer l'application (10 min)
```bash
# En tant qu'utilisateur medannot sur le VPS
su - medannot
cd /var/www/medannot

# Cloner
git clone https://github.com/Medannotations/MedAnnot-V1.git .

# Configurer
cp .env.infomaniak.example .env
nano .env  # Remplir tes credentials Infomaniak

# Installer
npm ci
npm run build
cd server && npm install && cd ..

# Démarrer
sudo systemctl start medannot
```

### Phase 5: SSL & Domaine (10 min)
```bash
# Configurer DNS chez Infomaniak:
# Type A: @ -> IP du VPS
# Type A: www -> IP du VPS

# Attendre propagation DNS (5-30 min)

# Générer SSL
sudo certbot --nginx -d medannot.ch -d www.medannot.ch
```

### Phase 6: Migrer les données (15 min)
```bash
# Sur ton ordinateur - exporter depuis Supabase
pg_dump "postgresql://postgres:pass@db.xxxx.supabase.co:5432/postgres" \
  --data-only --table=profiles --table=patients --table=annotations > data.sql

# Transférer sur VPS
scp data.sql medannot@<IP>:/tmp/

# Sur VPS - importer
psql "postgresql://user:pass@host.postgresql.infomaniak.ch:5432/medannot" < /tmp/data.sql
```

### Phase 7: Mettre à jour Stripe (5 min)
- [ ] Aller sur https://dashboard.stripe.com/webhooks
- [ ] Supprimer l'ancien endpoint Supabase
- [ ] Créer nouveau endpoint: `https://medannot.ch/api/webhooks/stripe`
- [ ] Sélectionner événements: checkout.session.completed, customer.subscription.updated, etc.
- [ ] Copier le nouveau webhook secret dans `.env`

### Phase 8: Tester (10 min)
- [ ] https://medannot.ch accessible
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création patient fonctionne
- [ ] Création annotation fonctionne
- [ ] Paiement Stripe fonctionne

## 🔧 Commandes utiles

### Sur le VPS
```bash
# Voir les logs application
sudo journalctl -u medannot -f
# ou
pm2 logs medannot-api

# Redémarrer l'app
sudo systemctl restart medannot

# Voir le statut
sudo systemctl status medannot

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Base de données
```bash
# Se connecter
psql "$DATABASE_URL"

# Backup
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

# Restore
psql "$DATABASE_URL" < backup-xxx.sql
```

## 📋 Variables d'environnement à remplir

Dans `.env` sur le VPS:

```env
# Database (Infomaniak te l'enverra par email)
DATABASE_URL=postgresql://username:password@xxxxx.postgresql.infomaniak.ch:5432/medannot

# JWT (générer: openssl rand -base64 64)
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe (déjà configurés chez toi)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (nouveau à récupérer après migration)

# Email (Infomaniak Mail)
SMTP_USER=noreply@medannot.ch
SMTP_PASS=...
```

## 🆘 En cas de problème

| Problème | Solution |
|----------|----------|
| `connexion refused` | Vérifier firewall: `sudo ufw status` |
| `404 Not Found` | Vérifier Nginx: `sudo nginx -t` |
| `500 Error` | Voir logs: `sudo journalctl -u medannot -n 50` |
| `DB connection failed` | Vérifier credentials dans `.env` |
| SSL expired | `sudo certbot renew` |

## 🎉 Après le déploiement

Une fois tout fonctionnel:
1. [ ] Couper l'ancien projet Vercel (évite les coûts doubles)
2. [ ] Supprimer les webhooks Supabase
3. [ ] Tester une inscription complète
4. [ ] Tester un paiement Stripe
5. [ ] Vérifier les emails partent bien

## 💰 Économies réalisées

| Avant | Après | Économie |
|-------|-------|----------|
| Vercel Pro: ~20$ | VPS Infomaniak: ~15 CHF | -25% |
| Supabase Pro: ~25$ | PostgreSQL Cloud: ~10 CHF | -60% |
| **Total: ~45$/mois** | **~26 CHF/mois** | **~-50%** |

Plus:
- ✅ Données en Suisse (RGPD médical)
- ✅ Souveraineté totale
- ✅ Pas de vendor lock-in

---

**Prochaine étape**: Attends l'email Infomaniak avec tes accès, puis on fait le déploiement ensemble ! 🚀
