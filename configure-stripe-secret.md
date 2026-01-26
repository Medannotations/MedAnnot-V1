# 🔑 CONFIGURER LE SECRET STRIPE (URGENT)

## Le problème

Erreur: "Invalid URL: An explicit scheme (such as https) must be provided."

Cette erreur signifie que le secret `STRIPE_SECRET_KEY` n'est **PAS configuré** dans Supabase.

---

## SOLUTION (2 minutes)

### Étape 1: Va sur Supabase Dashboard

**Ouvre ce lien:**
https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions

### Étape 2: Clique sur l'onglet "Secrets"

Tu devrais voir une liste de secrets ou un bouton "+ New Secret"

### Étape 3: Ajoute le secret Stripe

**Clique sur "+ New Secret" et entre:**

```
Name: STRIPE_SECRET_KEY
Value: sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64
```

**Clique "Add Secret"**

### Étape 4: REDÉPLOIE la fonction (OBLIGATOIRE)

Les secrets ne sont chargés qu'au déploiement. Lance :

```bash
cd "/Users/bmk/Desktop/Medannot V1"
npx supabase functions deploy stripe-checkout --project-ref vbaaohcsmiaxbqcyfhhl --no-verify-jwt
```

### Étape 5: Teste à nouveau

Ouvre `test-stripe-checkout.html` et clique sur "Tester"

Tu DOIS maintenant voir :
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

## VÉRIFICATION RAPIDE

**Pour vérifier si le secret est bien configuré:**

1. Va sur https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/functions
2. Clique sur "Secrets"
3. Tu devrais voir `STRIPE_SECRET_KEY` dans la liste

Si tu ne le vois PAS → Ajoute-le

Si tu le vois → Redéploie la fonction

---

**FAIS CETTE ÉTAPE MAINTENANT ET DIS-MOI QUAND C'EST FAIT !**
