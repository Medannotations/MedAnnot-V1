# 🚀 Guide Complet Infomaniak - MedAnnot
## De A à Z pour débutant absolu

---

## 📋 AVANT DE COMMENCER - Checklist

Avant de suivre ce guide, assure-toi d'avoir :
- [ ] Un compte Infomaniak créé
- [ ] Ton domaine `medannot.ch` enregistré chez Infomaniak
- [ ] Un moyen de paiement valide
- [ ] Environ 2-3 heures devant toi
- [ ] Un bloc-notes pour noter tes mots de passe

---

## ÉTAPE 1 : Commander les services (15 min)

### 1.1 Commander le VPS (Serveur)

1. Va sur : https://www.infomaniak.com/fr/hebergement/vps-cloud
2. Clique sur **"Commander un VPS"**
3. Choisis ces options :
   ```
   Système d'exploitation : Ubuntu 22.04 LTS (64 bits)
   Serveur Cloud : VPS Cloud 2 (2 vCPU, 4 GB RAM, 50 GB SSD)
   Localisation : Genève
   Backup quotidien : OUI (cocher)
   Période : 1 mois (ou 1 an pour -10%)
   ```
4. Clique **"Continuer"**
5. Crée ton compte ou connecte-toi
6. Paye

💰 **Coût** : ~15 CHF/mois

### 1.2 Commander le Cloud Server PostgreSQL (Base de données)

1. Va sur : https://www.infomaniak.com/fr/hebergement/serveur-cloud
2. Clique sur **"Créer un Serveur Cloud"**
3. Choisis :
   ```
   Type de serveur : PostgreSQL
   Version : 15
   Modèle : Small (1 vCPU, 2 GB RAM, 20 GB SSD)
   Localisation : Genève
   Backup : OUI (quotidien, conservé 14 jours)
   ```
4. Clique **"Créer"**
5. Configure :
   ```
   Nom de la base : medannot
   Nom d'utilisateur : medannot_user
   Mot de passe : [CRÉE UN MOT DE PASSE FORT - note-le !]
   ```
6. Paye

💰 **Coût** : ~10 CHF/mois

### 1.3 Vérifier que tu as reçu les emails

Tu vas recevoir 2 emails importants :
- **Email VPS** : avec l'IP du serveur et le mot de passe root
- **Email PostgreSQL** : avec l'hôte (hostname), le port, et les credentials

📧 **Conserve ces emails précieusement !**

---

## ÉTAPE 2 : Préparer ton ordinateur (10 min)

### 2.1 Sur Mac

Ouvre l'application **"Terminal"** (Cmd+Space, tape "Terminal")

### 2.2 Sur Windows

1. Télécharge **PuTTY** : https://www.putty.org/
2. Installe-le

### 2.3 Sur Linux

Ovre un terminal (Ctrl+Alt+T)

---

## ÉTAPE 3 : Se connecter au VPS pour la première fois (15 min)

### 3.1 Récupérer les infos

Dans l'email du VPS, note :
- **IP du serveur** (ex: 185.125.XXX.XXX)
- **Mot de passe root** (ex: Xk9#mP2$vL...)

### 3.2 Se connecter

**Sur Mac/Linux :**
```bash
ssh root@TON_IP_VPS
```

**Sur Windows (PuTTY) :**
1. Ouvre PuTTY
2. Host Name : `root@TON_IP_VPS`
3. Clique **Open**
4. Accepte la clé (clique Yes)

### 3.3 Première connexion

Quand on te demande le mot de passe, copie-colle celui de l'email.

⚠️ **Important** : Le mot de passe ne s'affiche PAS quand tu tapes (c'est normal !)

Tu devrais voir quelque chose comme :
```
Welcome to Ubuntu 22.04.3 LTS
root@vps-XXXXX:~#
```

🎉 **Félicitations, tu es connecté à ton serveur !**

---

## ÉTAPE 4 : Configurer le VPS (20 min)

### 4.1 Lancer le script automatique

Copie-colle cette commande (clique droit pour coller dans le terminal) :

```bash
curl -fsSL https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-vps.sh | bash
```

Le script va te poser des questions :
1. **Nom de domaine** : tape `medannot.ch`
2. **Email** : tape ton email
3. **Utilisateur** : tape `medannot` (c'est celui qui va gérer l'app)

⏱️ Attends 5-10 minutes que tout s'installe...

Tu verras des lignes défiler, c'est normal !

### 4.2 Vérifier que tout est OK

À la fin, tu devrais voir :
```
✅ SETUP TERMINÉ
```

Si tu vois des erreurs, copie-les et envoie-les moi.

### 4.3 Se déconnecter et se reconnecter

Tape :
```bash
exit
```

Puis reconnecte-toi avec le nouvel utilisateur :
```bash
ssh medannot@TON_IP_VPS
```

Mot de passe : celui que tu as créé pendant le setup

---

## ÉTAPE 5 : Configurer la base de données (15 min)

### 5.1 Récupérer les infos de l'email PostgreSQL

Dans l'email de confirmation PostgreSQL, note :
- **Host** (ex: `abc123.postgresql.infomaniak.ch`)
- **Port** (généralement `5432`)
- **Database** (`medannot`)
- **Username** (`medannot_user`)
- **Password** (celui que tu as créé)

### 5.2 Tester la connexion

Depuis ton ordinateur (pas le VPS), tape :

```bash
psql "postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot"
```

⚠️ Remplace `abc123`, `TON_MOT_DE_PASSE` par tes vraies valeurs !

Si ça marche, tu verras :
```
psql (15.x)
SSL connection
Type "help" for help.

medannot=>
```

Tape `\q` pour quitter.

🎉 **La base de données fonctionne !**

### 5.3 Créer les tables

Toujours depuis ton ordinateur :

1. Télécharge le schéma :
```bash
curl -o schema.sql https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/server/schema.sql
```

2. Importe-le :
```bash
psql "postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot" < schema.sql
```

Tu devrais voir plein de "CREATE TABLE" etc.

Vérifie que les tables sont créées :
```bash
psql "postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot" -c "\dt"
```

Tu devrais voir :
```
         List of relations
 Schema |   Name    | Type  |  Owner
--------+-----------+-------+----------
 public | annotations | table | medannot_user
 public | patients    | table | medannot_user
 public | profiles    | table | medannot_user
 public | webhook_events | table | medannot_user
```

---

## ÉTAPE 6 : Déployer l'application (20 min)

### 6.1 Se connecter au VPS (utilisateur medannot)

```bash
ssh medannot@TON_IP_VPS
```

### 6.2 Télécharger l'application

```bash
cd /var/www/medannot
git clone https://github.com/Medannotations/MedAnnot-V1.git .
```

### 6.3 Créer le fichier de configuration

```bash
cp .env.infomaniak.example .env
nano .env
```

Ça ouvre un éditeur de texte. Tu dois remplir :

```env
# =====================================================
# INFOMANIAK CONFIGURATION
# =====================================================

# Database (remplace par TES vraies valeurs !)
DATABASE_URL=postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot
PGHOST=abc123.postgresql.infomaniak.ch
PGPORT=5432
PGDATABASE=medannot
PGUSER=medannot_user
PGPASSWORD=TON_MOT_DE_PASSE

# Application
NODE_ENV=production
PORT=3000
VITE_APP_URL=https://medannot.ch

# JWT Secret (génère un mot de passe aléatoire de 64 caractères)
# Tape cette commande sur ton Mac pour générer : openssl rand -base64 64
JWT_SECRET=colle_ici_le_resultat_de_la_commande

# Stripe (tes vraies clés)
STRIPE_PUBLISHABLE_KEY=pk_live_TA_CLE_PUBLIQUE
STRIPE_SECRET_KEY=sk_live_TA_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_TON_SECRET_WEBHOOK

# Email Infomaniak (si tu as un email chez eux)
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@medannot.ch
SMTP_PASS=mot_de_passe_email
SMTP_FROM=MedAnnot <noreply@medannot.ch>
```

**Pour sauvegarder dans nano :**
1. Ctrl+O (puis Entrée)
2. Ctrl+X (pour quitter)

### 6.4 Installer l'application

```bash
# Installer les dépendances
npm ci

# Builder le frontend
npm run build

# Installer le serveur
cd server
npm install
cd ..

# Démarrer l'application
sudo systemctl start medannot

# Vérifier que ça tourne
sudo systemctl status medannot
```

Tu devrais voir `active (running)` en vert.

### 6.5 Tester l'application

```bash
# Test local
curl http://localhost:3000/api/health
```

Tu devrais voir :
```json
{"status":"ok","timestamp":"2024-...","version":"1.0.0"}
```

🎉 **L'application fonctionne sur le serveur !**

---

## ÉTAPE 7 : Configurer Nginx et SSL (15 min)

### 7.1 Configurer le domaine

1. Va sur https://manager.infomaniak.com
2. Connecte-toi
3. Va dans **Domain** > **medannot.ch** > **DNS Zone**
4. Ajoute/modifie ces entrées :

```
Type: A
Name: @
Target: TON_IP_VPS
TTL: 3600

Type: A
Name: www
Target: TON_IP_VPS
TTL: 3600
```

5. Sauvegarde

⏱️ Attends 5-30 minutes que ça se propage...

### 7.2 Vérifier que le domaine pointe bien

Sur ton ordinateur :
```bash
ping medannot.ch
```

Tu devrais voir l'IP de ton VPS.

### 7.3 Générer le certificat SSL

Sur le VPS :
```bash
sudo certbot --nginx -d medannot.ch -d www.medannot.ch
```

Réponds :
- Email : ton email
- Terms of Service : A (Accepter)
- Newsletter : N (Non merci)
- Redirect HTTP to HTTPS : 2 (Redirect)

✅ SSL installé !

### 7.4 Tester en HTTPS

Sur ton ordinateur :
```bash
curl https://medannot.ch/api/health
```

Tu devrais voir le même JSON qu'avant, mais en HTTPS !

---

## ÉTAPE 8 : Migrer les données de Supabase (20 min)

### 8.1 Exporter les données de Supabase

Sur ton ordinateur, installe d'abord PostgreSQL client si ce n'est pas déjà fait :

**Mac :**
```bash
brew install postgresql@15
```

**Windows :**
Télécharge : https://www.postgresql.org/download/windows/

**Linux :**
```bash
sudo apt install postgresql-client
```

### 8.2 Exporter les données

```bash
# Exporte les données Supabase
# Remplace les XXX par tes vraies infos Supabase
pg_dump "postgresql://postgres:XXX@db.XXX.supabase.co:5432/postgres" \
  --data-only \
  --table=profiles \
  --table=patients \
  --table=annotations \
  > migration.sql
```

⚠️ Récupère tes credentials Supabase dans Settings > Database

### 8.3 Importer dans Infomaniak

```bash
# Importe dans la nouvelle base
psql "postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot" < migration.sql
```

### 8.4 Vérifier la migration

```bash
psql "postgresql://medannot_user:TON_MOT_DE_PASSE@abc123.postgresql.infomaniak.ch:5432/medannot" \
  -c "SELECT COUNT(*) FROM profiles;"
```

Tu devrais voir le nombre d'utilisateurs.

🎉 **Données migrées !**

---

## ÉTAPE 9 : Mettre à jour Stripe (10 min)

### 9.1 Aller sur le Dashboard Stripe

https://dashboard.stripe.com/webhooks

### 9.2 Supprimer l'ancien webhook

Trouve celui qui pointe vers Supabase :
`https://xxxx.supabase.co/functions/v1/stripe-webhook`

Clique dessus → **Delete**

### 9.3 Créer le nouveau webhook

Clique **"Add endpoint"**

```
Endpoint URL: https://medannot.ch/api/webhooks/stripe
Description: MedAnnot Production (Infomaniak)
```

Sélectionne ces événements :
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

Clique **"Add endpoint"**

### 9.4 Récupérer le secret

Clique sur le nouveau webhook créé.

À droite, clique **"Reveal"** sous **Signing secret**

Copie la valeur qui commence par `whsec_`

### 9.5 Mettre à jour le .env sur le VPS

```bash
ssh medannot@TON_IP_VPS
cd /var/www/medannot
nano .env
```

Remplace :
```env
STRIPE_WEBHOOK_SECRET=whsec_LE_NOUVEAU_SECRET
```

Sauvegarde (Ctrl+O, Entrée, Ctrl+X)

Redémarre l'app :
```bash
sudo systemctl restart medannot
```

---

## ÉTAPE 10 : Tests finaux (20 min)

### 10.1 Test 1 : Page d'accueil

Ouvre ton navigateur : https://medannot.ch

Tu devrais voir la page MedAnnot !

### 10.2 Test 2 : API

```bash
curl https://medannot.ch/api/health
```

Doit retourner `{"status":"ok"...}`

### 10.3 Test 3 : Inscription

1. Va sur https://medannot.ch
2. Clique **"S'inscrire"**
3. Crée un compte test
4. Vérifie que tu reçois l'email de confirmation (si configuré)

### 10.4 Test 4 : Connexion

Connecte-toi avec le compte créé.

Tu devrais arriver sur le dashboard.

### 10.5 Test 5 : Créer un patient

1. Clique **"Nouveau patient"**
2. Remplis les infos
3. Sauvegarde

Le patient doit apparaître dans la liste !

### 10.6 Test 6 : Créer une annotation

1. Va sur un patient
2. Clique **"Nouvelle annotation"**
3. Tape du texte
4. Sauvegarde

L'annotation doit apparaître !

### 10.7 Test 7 : Paiement Stripe (TEST)

⚠️ **Important** : Fais ce test en mode TEST d'abord !

1. Dans Stripe Dashboard, passe en mode "Test"
2. Sur MedAnnot, essaie de souscrire
3. Utilise la carte de test : `4242 4242 4242 4242`
4. N'importe quelle date future, n'importe quel CVC

Le paiement doit réussir !

### 10.8 Test 8 : Portail client

1. Va dans Paramètres > Abonnement
2. Clique **"Gérer sur Stripe"**
3. Le portail Stripe doit s'ouvrir

---

## ÉTAPE 11 : Go Live ! (5 min)

### 11.1 Passer Stripe en mode LIVE

1. Dans Stripe Dashboard, active le compte
2. Récupère les clés LIVE (`pk_live_` et `sk_live_`)
3. Mets à jour le `.env` sur le VPS
4. Redémarre : `sudo systemctl restart medannot`

### 11.2 Vérifier les emails

Si tu as configuré SMTP, envoie-toi un email de test.

### 11.3 Annoncer la mise en ligne !

🎉 **TON SAAS EST EN LIGNE !**

---

## 🔧 MAINTENANCE QUOTIDIENNE

### Redémarrer l'application

```bash
ssh medannot@TON_IP_VPS
sudo systemctl restart medannot
```

### Voir les logs

```bash
ssh medannot@TON_IP_VPS
sudo journalctl -u medannot -f
```

Ctrl+C pour quitter

### Backup manuel de la DB

```bash
pg_dump "postgresql://medannot_user:MDP@HOST.postgresql.infomaniak.ch:5432/medannot" \
  > backup-$(date +%Y%m%d).sql
```

### Mettre à jour l'application

```bash
ssh medannot@TON_IP_VPS
cd /var/www/medannot
git pull
npm ci
npm run build
cd server && npm install && cd ..
sudo systemctl restart medannot
```

---

## 🆘 DÉPANNAGE

### Problème : "Cannot connect to server"

**Cause** : L'app ne tourne pas

**Solution** :
```bash
ssh medannot@TON_IP_VPS
sudo systemctl status medannot

# Si ça dit "failed"
sudo systemctl restart medannot

# Voir les erreurs
sudo journalctl -u medannot -n 50
```

### Problème : "502 Bad Gateway"

**Cause** : Nginx ne trouve pas l'app

**Solution** :
```bash
ssh medannot@TON_IP_VPS
sudo systemctl restart nginx
sudo systemctl restart medannot
```

### Problème : "Database connection failed"

**Cause** : Mauvais credentials dans .env

**Solution** :
```bash
ssh medannot@TON_IP_VPS
cd /var/www/medannot
nano .env
# Vérifie DATABASE_URL
sudo systemctl restart medannot
```

### Problème : Certificat SSL expiré

**Solution** :
```bash
ssh medannot@TON_IP_VPS
sudo certbot renew
sudo systemctl restart nginx
```

---

## 📞 SUPPORT

| Problème | Qui contacter |
|----------|--------------|
| VPS ne démarre pas | Infomaniak support |
| PostgreSQL inaccessible | Infomaniak support |
| Application bug | Moi / GitHub Issues |
| Stripe ne marche pas | Stripe support |

**Infomaniak** : https://support.infomaniak.com (chat 24/7)

---

## ✅ CHECKLIST FINALE

Avant de dire "c'est bon", vérifie :

- [ ] https://medannot.ch charge
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création patient fonctionne
- [ ] Création annotation fonctionne
- [ ] Paiement Stripe fonctionne (test)
- [ ] Portail Stripe fonctionne
- [ ] Données migrées (vérifie quelques patients)
- [ ] Backup configuré
- [ ] SSL valide (cadenas vert)

---

**🎉 FÉLICITATIONS ! Tu as déployé MedAnnot sur Infomaniak !**

Tu as maintenant :
- ✅ Un VPS sécurisé (firewall, SSL)
- ✅ Une base de données PostgreSQL professionnelle
- ✅ Backups automatiques
- ✅ Conformité LPD suisse
- ✅ ISO 27001 / FINMA

**Coût total : ~26 CHF/mois**

---

Besoin d'aide ? Envoie-moi :
1. Les logs d'erreur (`sudo journalctl -u medannot -n 50`)
2. Une description du problème
3. Des captures d'écran si possible

Je suis là pour t'aider ! 🚀
