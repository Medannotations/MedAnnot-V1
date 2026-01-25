# 🔍 DIAGNOSTIC - Erreur "Impossible de créer la page de paiement"

## Causes possibles

### 1️⃣ La fonction Supabase n'est PAS déployée ⚠️

**Symptôme:** Erreur 404 ou "Function not found"

**Solution:**
```bash
cd "/Users/bmk/Desktop/Medannot V1"
./DEPLOY.sh
```

Ou manuellement :
```bash
npx supabase login
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl
```

---

### 2️⃣ Les secrets Stripe ne sont PAS configurés dans Supabase ⚠️

**Symptôme:** Erreur "No API key provided" ou erreur 500

**Solution:**

1. Va sur https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions
2. Clique sur **"Secrets"**
3. Ajoute ce secret :

| Nom | Valeur |
|-----|--------|
| `STRIPE_SECRET_KEY` | `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64` |

**ATTENTION:** Après avoir ajouté le secret, **RE-DÉPLOIE** la fonction :
```bash
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl
```

---

### 3️⃣ Les Price IDs Stripe sont incorrects

**Vérification:**

Va sur https://dashboard.stripe.com/test/products et vérifie que ces Price IDs existent :

- Mensuel : `price_1StWgr6OhZ2TN4iPIwcnJEqp`
- Annuel : `price_1StWu76OhZ2TN4iPchmtTRty`

Si ces IDs n'existent pas, crée-les :

1. Va sur Stripe Dashboard → Products
2. Crée un produit "Medannot"
3. Ajoute 2 prix :
   - 189 CHF/mois (recurring monthly)
   - 1499 CHF/an (recurring yearly)
4. Copie les Price IDs (commence par `price_...`)
5. Mets-les dans `.env` :
   ```
   VITE_STRIPE_PRICE_ID_MONTHLY=price_xxx
   VITE_STRIPE_PRICE_ID_YEARLY=price_yyy
   ```
6. Redéploie sur Vercel

---

### 4️⃣ Les variables d'environnement ne sont pas chargées

**Si tu testes en LOCAL:**

1. Arrête le serveur dev (`Ctrl+C`)
2. Relance :
   ```bash
   npm run dev
   ```

**Si tu testes en PRODUCTION (Vercel):**

1. Va sur https://vercel.com/medannotations/medannot-v1/settings/environment-variables
2. Vérifie que ces variables existent :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PRICE_ID_MONTHLY`
   - `VITE_STRIPE_PRICE_ID_YEARLY`

3. Si elles manquent, ajoute-les et redéploie

---

### 5️⃣ Problème de CORS

**Symptôme:** Erreur "CORS policy" dans la console

**Solution:** Vérifie que dans `supabase/functions/stripe-checkout/index.ts`, les headers CORS sont bien présents :

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

---

## 🧪 ÉTAPES DE DIAGNOSTIC

### Étape 1: Teste avec la page HTML

J'ai créé `test-stripe-checkout.html`. Ouvre-le dans ton navigateur :

```bash
open "/Users/bmk/Desktop/Medannot V1/test-stripe-checkout.html"
```

Clique sur "Tester la fonction" et regarde l'erreur exacte.

### Étape 2: Vérifie les logs Supabase

1. Va sur https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/logs/edge-functions
2. Cherche "stripe-checkout"
3. Regarde les erreurs

### Étape 3: Vérifie la console du navigateur

1. Va sur ta page `/signup`
2. Ouvre la console (F12)
3. Essaye de t'inscrire
4. Regarde les erreurs réseau (onglet Network)

---

## 📝 CHECKLIST DE VÉRIFICATION

- [ ] La fonction `stripe-checkout` est déployée sur Supabase
- [ ] Le secret `STRIPE_SECRET_KEY` est configuré dans Supabase
- [ ] Les Price IDs existent dans Stripe Dashboard
- [ ] Les variables d'environnement sont dans `.env`
- [ ] Le serveur dev est redémarré (si local)
- [ ] Vercel a les bonnes variables d'environnement (si prod)

---

## 🆘 SOLUTION RAPIDE

**Si tu veux une solution qui marche à coup sûr:**

1. **Déploie la fonction:**
   ```bash
   ./DEPLOY.sh
   ```

2. **Configure le secret Stripe dans Supabase:**
   - Dashboard → Settings → Edge Functions → Secrets
   - Ajoute `STRIPE_SECRET_KEY` avec la clé `sk_test_...`

3. **Re-déploie la fonction après avoir ajouté le secret:**
   ```bash
   npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl
   ```

4. **Teste avec la page HTML** pour confirmer que ça marche

5. **Teste sur l'app**

---

**Dis-moi ce que tu vois dans la page de test HTML !**
