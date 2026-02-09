# =====================================================
# Dockerfile MedAnnot - Production
# Swiss Safe Cloud Ready
# =====================================================

# Étape 1: Build du frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci --only=production=false

# Copier le code source
COPY . .

# Build production
RUN npm run build

# =====================================================
# Étape 2: Serveur Node.js
# =====================================================
FROM node:20-alpine AS server

WORKDIR /app

# Installer les dépendances système
RUN apk add --no-cache postgresql-client

# Copier package.json du serveur
COPY server/package*.json ./
RUN npm ci --only=production

# Copier le code du serveur
COPY server/ ./

# Copier le build frontend
COPY --from=frontend-builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Exposer le port
EXPOSE 3000

# Démarrer
CMD ["node", "index.js"]

# =====================================================
# Étape 3: Nginx (optionnel - pour scaling)
# =====================================================
FROM nginx:alpine AS nginx

# Configuration nginx optimisée
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
