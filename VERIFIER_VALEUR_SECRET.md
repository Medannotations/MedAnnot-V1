# 🔍 VÉRIFIER LA VALEUR DU SECRET

## Le problème

L'erreur persiste, ce qui signifie que la **valeur** du secret `STRIPE_SECRET_KEY` est probablement **incorrecte**.

---

## ÉTAPES PRÉCISES

### 1. Va sur Supabase Dashboard

J'ai ouvert : https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions

### 2. Clique sur l'onglet "Secrets"

### 3. Trouve STRIPE_SECRET_KEY dans la liste

Tu devrais le voir avec une valeur hashée (comme `37c0ebd2c13039050693f548435ce94206ded7580edfb83a879ff9d0ca1d4dba`)

### 4. CLIQUE SUR L'ICÔNE ŒIL 👁️

À côté de `STRIPE_SECRET_KEY`, il y a une icône "œil" ou "voir".

**Clique dessus pour révéler la vraie valeur.**

### 5. Vérifie la valeur

**La valeur DOIT commencer par :**
```
sk_test_51StDyP6...
```

**Possible résultats :**

**✅ Si tu vois : `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64`**
→ Le secret est CORRECT
→ Va à l'étape 6

**❌ Si tu vois autre chose (ex: une autre clé, une valeur vide, etc.)**
→ Le secret est INCORRECT
→ Va à l'étape 7

### 6. Si le secret est CORRECT

Le problème vient d'ailleurs. Lance ces commandes pour débugger :

```bash
# Voir les logs de la fonction
open "https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/logs/edge-functions"
```

Puis cherche "stripe-checkout" dans les logs et partage-moi l'erreur exacte.

### 7. Si le secret est INCORRECT

**Édite le secret :**

1. Clique sur l'icône **crayon ✏️** ou **"Edit"** à côté de `STRIPE_SECRET_KEY`
2. Supprime la valeur actuelle
3. Copie-colle **EXACTEMENT** cette valeur :
   ```
   sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64
   ```
4. Clique **"Save"** ou **"Update"**
5. **ATTENDS** que le secret soit sauvegardé (message de confirmation)
6. **REDÉPLOIE** la fonction :
   ```bash
   cd "/Users/bmk/Desktop/Medannot V1"
   npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt
   ```
7. **TESTE** à nouveau :
   ```bash
   open test-stripe-checkout.html
   ```

---

## 🎯 CE QUI DOIT SE PASSER

Après avoir corrigé la valeur et redéployé, le test HTML doit retourner :

```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 📸 ACTION REQUISE

**Clique sur l'icône œil 👁️ à côté de STRIPE_SECRET_KEY et dis-moi :**

**Option A :** "La valeur commence par `sk_test_51StDyP6...`" ✅

**Option B :** "La valeur est différente : [copie-colle ce que tu vois]" ❌

**Option C :** "Je ne vois pas d'icône œil" ❌

---

**FAIS ÇA MAINTENANT ET DIS-MOI CE QUE TU VOIS !**
