# 🚀 MedAnnot sur Exoscale

## 📋 Vue d'ensemble

Déploiement de MedAnnot sur **Exoscale** (Suisse) avec architecture simplifiée mais production-ready.

```
┌─────────────────────────────────────────────────────────────┐
│                    EXOSCALE (Suisse)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐 medannot.ch (DNS chez Infomaniak)                      │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Instance Exoscale                                  │   │
│  │  • Standard Small (2 vCPU, 4 GB, 50 GB)            │   │
│  │  • Ubuntu 22.04 LTS                                 │   │
│  │                                                     │   │
│  │  Docker Compose:                                    │   │
│  │    • Nginx (SSL)                                    │   │
│  │    • Node.js (API)                                  │   │
│  │    • Redis (Cache)                                  │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                           │
│  ┌──────────────▼──────────────────────────────────────┐   │
│  │  DBaaS PostgreSQL (Exoscale)                        │   │
│  │  • Hobbyist (2 vCPU, 4 GB, 20 GB)                  │   │
│  │  • Backup quotidien                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💰 ~41 CHF/mois | 🇨🇭 100% Suisse                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Pourquoi Exoscale ?

| Avantage | Description |
|----------|-------------|
| 🇨🇭 **100% Suisse** | Datacenters Genève & Zurich |
| 🔒 **Certifié** | ISO 27001, FINMA, LPD compliant |
| 💰 **Prix transparent** | Pas de devis, prix affichés |
| 🚀 **Simple** | Interface claire, setup rapide |
| 📈 **Scalable** | Upgrade en 1 clic |

---

## 📦 Services à commander

### 1. Exoscale Instance (Application)
```
Type: Standard Small
  • 2 vCPU
  • 4 GB RAM
  • 50 GB SSD
  • Zone: ch-gva-2 (Genève) ou ch-dk-2 (Zurich)
Prix: ~25 CHF/mois
```

### 2. Exoscale DBaaS PostgreSQL (Database)
```
Type: Hobbyist
  • 2 vCPU
  • 4 GB RAM
  • 20 GB Storage
  • PostgreSQL 15
  • Backup quotidien inclus
Prix: ~15 CHF/mois
```

### 3. Infomaniak Domaine (déjà possédé)
```
medannot.ch
DNS: Pointer vers IP Exoscale
```

**Total: ~41 CHF/mois**

---

## 🚀 Guide Rapide

### Étape 1: Créer compte Exoscale
🔗 https://portal.exoscale.com

### Étape 2: Commander services
- Instance (Ubuntu 22.04)
- DBaaS PostgreSQL

### Étape 3: Setup automatique
```bash
# Sur le serveur (en root)
curl -fsSL https://raw.githubusercontent.com/Medannotations/MedAnnot-V1/main/scripts/setup-exoscale.sh | bash
```

### Étape 4: Déployer
```bash
# En tant qu'utilisateur medannot
cd /opt/medannot
git clone https://github.com/Medannotations/MedAnnot-V1.git .
cp .env.exoscale.example .env
# Éditer .env avec tes valeurs
nano .env

# Lancer
docker compose -f docker-compose.exoscale.yml up -d
```

### Étape 5: SSL
```bash
# Générer certificat
docker run -it --rm \
  -v /opt/medannot/certbot_data:/etc/letsencrypt \
  -v /opt/medannot/certbot_www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d medannot.ch \
  -d www.medannot.ch \
  --email ton@email.com \
  --agree-tos \
  --non-interactive
```

---

## 📚 Documentation complète

- **Guide détaillé**: [EXOSCALE_COMPLETE_GUIDE.md](EXOSCALE_COMPLETE_GUIDE.md)
- **Architecture**: [SWISS_SAFE_CLOUD_ARCHITECTURE.md](SWISS_SAFE_CLOUD_ARCHITECTURE.md) (voir section Exoscale)

---

## 🔧 Commandes utiles

### Sur le serveur
```bash
# Connexion SSH
ssh medannot@IP_EXOSCALE

# Voir les logs
docker compose logs -f app

# Redémarrer
docker compose restart app

# Mettre à jour
git pull && docker compose up -d --build

# Backup DB
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql
```

---

## 🆘 Support

| Problème | Contact |
|----------|---------|
| Exoscale (infra) | support@exoscale.com |
| Application | GitHub Issues |
| Domaine | Infomaniak Support |

---

**🎉 Prêt à déployer ? Commence par le [guide complet](EXOSCALE_COMPLETE_GUIDE.md) !**
