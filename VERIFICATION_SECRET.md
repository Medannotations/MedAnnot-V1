# 🔍 VÉRIFICATION DU SECRET STRIPE

## L'erreur persiste

L'erreur "Invalid URL" signifie que le secret `STRIPE_SECRET_KEY` n'est **toujours pas** chargé dans la fonction.

---

## ÉTAPES DE VÉRIFICATION

### 1. Ouvre la page Supabase

J'ai ouvert : https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions

### 2. Clique sur l'onglet "Secrets"

En haut de la page, tu dois voir :
- General
- **Secrets** ← CLIQUE ICI
- Logs

### 3. Vérifie LA LISTE des secrets

Dans l'onglet Secrets, regarde ATTENTIVEMENT la liste.

**QUESTION IMPORTANTE :**

**Vois-tu exactement ceci dans la liste ?**
```
STRIPE_SECRET_KEY
```

**Possible problèmes :**
- ❌ Tu ne vois RIEN dans la liste → Le secret n'a pas été ajouté
- ❌ Tu vois un autre nom (ex: `Stripe_Secret_Key`, `stripe_secret_key`) → Mauvais nom
- ❌ La liste est vide → Tu n'es pas sur le bon projet
- ✅ Tu vois exactement `STRIPE_SECRET_KEY` → Le secret existe

### 4. Si le secret existe, vérifie la valeur

1. Clique sur l'icône "œil" 👁️ à côté du secret
2. La valeur doit commencer par : `sk_test_51StDyP6...`

**Si la valeur est différente ou vide :**
- Clique sur "Edit" ou l'icône crayon ✏️
- Remplace par : `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64`
- Sauvegarde

### 5. Si le secret N'EXISTE PAS

**Ajoute-le MAINTENANT :**

1. Clique sur **"+ New Secret"** (bouton en haut à droite)
2. Un formulaire apparaît
3. Entre **EXACTEMENT** :
   - **Name:** `STRIPE_SECRET_KEY` (copie-colle pour éviter les erreurs)
   - **Value:** `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64`
4. Clique **"Add"** ou **"Create"**
5. Attends que le secret soit sauvegardé (un message de confirmation doit apparaître)

### 6. REDÉPLOIE (OBLIGATOIRE)

Après avoir ajouté/modifié le secret, tu DOIS redéployer :

```bash
cd "/Users/bmk/Desktop/Medannot V1"
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt
```

### 7. TESTE à nouveau

```bash
open test-stripe-checkout.html
```

Clique sur "Tester" et tu DOIS voir une URL Stripe.

---

## 📸 CAPTURE D'ÉCRAN

**Peux-tu faire une capture d'écran de l'onglet "Secrets" et me dire ce que tu vois ?**

Ou dis-moi simplement :
- "Je vois STRIPE_SECRET_KEY dans la liste" ✅
- "Je ne vois rien dans la liste" ❌
- "Je vois un autre nom" ❌

---

## ⚠️ VÉRIFICATION DU BON PROJET

Assure-toi d'être sur le BON projet Supabase.

En haut de la page, tu dois voir :
```
vbaaohcsmiaxbqcyfhhl
```

Si tu vois un autre ID (comme `hnlrvlhhimkqezjoslmy`), tu es sur le MAUVAIS projet !

Dans ce cas :
1. Clique sur le nom du projet en haut à gauche
2. Sélectionne le projet avec l'ID `vbaaohcsmiaxbqcyfhhl`
3. Retourne sur Settings → Edge Functions → Secrets

---

**DIS-MOI CE QUE TU VOIS EXACTEMENT DANS L'ONGLET SECRETS !**
