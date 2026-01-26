# 🔑 AJOUTER LE SECRET STRIPE DANS SUPABASE

## Le problème

L'erreur "Stripe configuration error: Missing API key" signifie que **le secret n'existe PAS dans Supabase**.

---

## SOLUTION (Étape par étape avec captures)

### Étape 1: Ouvre la page des secrets

J'ai ouvert cette page dans ton navigateur :
https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions

### Étape 2: Va sur l'onglet "Secrets"

En haut de la page, tu devrais voir plusieurs onglets :
- General
- **Secrets** ← CLIQUE ICI
- Logs

### Étape 3: Vérifie si le secret existe

Dans l'onglet Secrets, regarde la liste des secrets.

**Question importante : Vois-tu `STRIPE_SECRET_KEY` dans la liste ?**

- **OUI** → Le secret existe déjà
- **NON** → Il faut l'ajouter

### Étape 4A: Si le secret N'EXISTE PAS

1. Clique sur le bouton **"+ New Secret"** ou **"Add new secret"**
2. Un formulaire apparaît avec 2 champs :

   **Name:**
   ```
   STRIPE_SECRET_KEY
   ```

   **Value:**
   ```
   sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64
   ```

3. Clique sur **"Add"** ou **"Create"**
4. Attends que le secret soit sauvegardé
5. **IMPORTANT:** Va à l'étape 5 (redéployer)

### Étape 4B: Si le secret EXISTE DÉJÀ

1. Clique sur l'icône **"œil"** pour voir la valeur
2. Vérifie que la valeur commence bien par `sk_test_51StDyP6...`
3. Si la valeur est différente, clique sur **"Edit"** ou **"Modifier"**
4. Remplace par la bonne valeur (voir ci-dessus)
5. **IMPORTANT:** Va à l'étape 5 (redéployer)

### Étape 5: REDÉPLOYER (OBLIGATOIRE)

Les secrets ne sont chargés que lors du déploiement. Tu DOIS redéployer :

```bash
cd "/Users/bmk/Desktop/Medannot V1"
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt
```

Ou lance ce script :
```bash
./QUICK_DEPLOY.sh
```

### Étape 6: Tester

Après le redéploiement, ouvre à nouveau la page de test :
```bash
open test-stripe-checkout.html
```

Clique sur "Tester" et tu DOIS voir une URL Stripe.

---

## 🔍 DIAGNOSTIC

**Pour vérifier si le secret est bien là:**

1. Va sur https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions
2. Clique sur **"Secrets"**
3. Cherche **"STRIPE_SECRET_KEY"** dans la liste

**Il DOIT apparaître dans la liste.**

Si tu ne le vois PAS → Ajoute-le (Étape 4A)
Si tu le vois → Vérifie la valeur (Étape 4B)

---

## ❓ QUESTIONS

**Q: Je ne vois pas l'onglet "Secrets"**
R: Tu es peut-être sur la mauvaise page. Assure-toi d'être sur :
   Settings → Edge Functions (dans le menu de gauche)

**Q: Le bouton "+ New Secret" est grisé**
R: Tu n'as peut-être pas les permissions. Vérifie que tu es bien connecté avec le bon compte Supabase.

**Q: J'ai ajouté le secret mais ça ne marche toujours pas**
R: As-tu redéployé la fonction après ? C'est OBLIGATOIRE.

---

**FAIS CES ÉTAPES ET DIS-MOI CE QUE TU VOIS DANS L'ONGLET SECRETS !**
