# Optimisations de Performance MedAnnot

## Problèmes identifiés et solutions

### 1. Chargements lents à la connexion/navigation

**Cause principale** : Re-vérification systématique de l'authentification et de l'abonnement à chaque navigation.

**Solutions implémentées** :

#### React Query Optimisé
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // Données fraîches pendant 5 min
      gcTime: 1000 * 60 * 30,       // Garde en cache 30 min
      retry: 1,                      // 1 seule tentative en cas d'erreur
      refetchOnWindowFocus: false,   // Pas de rechargement au retour sur l'onglet
      refetchOnMount: false,         // Utilise le cache si disponible
    },
  },
});
```

#### SubscriptionGuard optimisé
- Timeout de sécurité de 10 secondes maximum
- Grâce de 30 minutes pour les nouveaux utilisateurs
- Vérification du statut d'abonnement simplifiée

### 2. Cache et staleTime

**Patients** : Cache de 5 minutes, évite de recharger la liste à chaque navigation.
**Annotations** : Cache de 5 minutes avec invalidation intelligente après création/modification.
**Profil utilisateur** : Récupération immédiate à la connexion, puis cache.

### 3. Recommandations pour aller plus loin

#### Lazy Loading (Code Splitting)
Pour les pages peu fréquentes comme Settings, on pourrait implémenter :
```typescript
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
```

#### Préchargement intelligent
Précharger les données critiques dès la connexion :
- Liste des patients (en arrière-plan)
- Configuration utilisateur
- Templates de phrases

#### Optimisation Supabase
- Ajouter des index sur les colonnes fréquemment filtrées
- Utiliser `.select()` avec sélection de colonnes spécifiques
- Implémenter la pagination pour les grandes listes

#### Service Worker
Actuellement en place mais peut être optimisé :
- Cache des assets statiques
- Stratégie "Cache First" pour les données fréquentes
- Background sync pour les modifications offline

## Métriques à surveiller

1. **Time to First Byte (TTFB)** : Doit être < 200ms
2. **First Contentful Paint (FCP)** : Doit être < 1.8s
3. **Largest Contentful Paint (LCP)** : Doit être < 2.5s
4. **Time to Interactive (TTI)** : Doit être < 3.8s

## Outils de monitoring recommandés

- Chrome DevTools Performance Tab
- Lighthouse CI
- Vercel Analytics (déjà inclus)
- Sentry Performance (à ajouter si besoin)

## Prochaines optimisations prioritaires

1. [ ] Implémenter React.lazy() pour les pages secondaires
2. [ ] Ajouter intersection observer pour le lazy loading des images
3. [ ] Optimiser les requêtes Supabase avec des vues matérialisées
4. [ ] Implémenter un système de cache local plus agressif pour les données patients
5. [ ] Ajouter un indicateur de chargement progressif (skeleton screens)
