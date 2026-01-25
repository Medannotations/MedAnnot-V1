# 🎯 MEDANNOT - INSTRUCTIONS FINALES

## 📊 STATUS ACTUEL

✅ **FAIT :**
- Landing page déployée avec prix (189 CHF/mois, 1499 CHF/an)
- Code sur GitHub: https://github.com/Medannotations/MedAnnot-V1
- Déployé sur Vercel (en production)
- Architecture complète Stripe + Supabase

⏳ **À FAIRE (3 ÉTAPES - 20 MIN) :**

---

## 🔥 ÉTAPE 1 : Migration SQL Supabase (5 min)

**Ouvre:** https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/sql/new

**Copie-colle EXACTEMENT :**

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
ON public.profiles(stripe_customer_id);
```

**Clique "RUN"** ✓

---

## 🔐 ÉTAPE 2 : Secrets Supabase (5 min)

**Ouvre:** https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/settings/secrets

**Ajoute 4 secrets (clique "+ New Secret" 4 fois) :**

**Secret 1:**
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_test_51StDyP6OhZ2TN4iPkinhtiCQ6lVYxrLi4NwJKyb6Khw7aElzTh2udjmegA5OzIfJqxl6T7vnkmyhztPillQPMy3J00Da4ART64`

**Secret 2:**
- Key: `PROJECT_URL`
- Value: `https://vbaaohcsmiaxbqcyfhhl.supabase.co`

**Secret 3:**
- Key: `SERVICE_ROLE_KEY`
- Value: Va dans **Settings > API > Service Role Secret** et copie-colle la vraie clé

**Secret 4:**
- Key: `STRIPE_WEBHOOK_SECRET`
- Value: **À récupérer dans Stripe (voir ÉTAPE 3)**

---

## 🪝 ÉTAPE 3 : Webhook Stripe (10 min)

**Ouvre:** https://dashboard.stripe.com/test/webhooks

**Clique "Add endpoint"**

**Endpoint URL:**
```
https://vbaaohcsmiaxbqcyfhhl.supabase.co/functions/v1/stripe-webhook
```

**Événements à cocher :**
- ✅ checkout.session.completed
- ✅ customer.subscription.updated
- ✅ customer.subscription.deleted
- ✅ invoice.payment_failed

**Clique "Add endpoint"**

**Récupère le Signing Secret :**
- L'endpoint vient d'être créé, clique dessus
- Scroll down et cherche "Signing secret" (commence par `whsec_`)
- Copie-le
- Mets-le dans Supabase Secrets (ÉTAPE 2, Secret 4)

---

## ✅ TESTS FINAUX

**Test 1 - Landing Page:**
- Va sur https://medannot-v1.vercel.app
- Vérifie les prix : 189 CHF (mensuel) et 1499 CHF (annuel)
- ✓ OK

**Test 2 - Essai gratuit:**
- Clique "Essayer gratuitement"
- Entre un email et mot de passe
- Clique le bouton de paiement
- Sélectionne un plan

**Test 3 - Paiement (avec carte de TEST):**
- Carte: `4242 4242 4242 4242`
- Date: `12/25`
- CVC: `123`
- Valide

**Test 4 - Vérifier Supabase:**
- Va dans https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/editor/users
- Cherche ton utilisateur
- Vérifie les colonnes remplies :
  - `stripe_customer_id` ≠ NULL ✓
  - `subscription_status` = 'active' ✓
  - `subscription_current_period_end` = date future ✓

---

## 🎉 C'EST BON !

Si tous les tests passent, tu peux **commencer à attirer des clients** ! 

La plateforme est **100% sécurisée et fonctionnelle** en mode test Stripe.

**Pour passer en production :**
1. Va sur Stripe (mode Live, pas Test)
2. Récupère les vraies clés : `pk_live_...` et `sk_live_...`
3. Mets à jour Vercel et Supabase avec les vraies clés
4. Reconfigure le webhook Stripe avec la vraie clé

---

## 📞 SUPPORT RAPIDE

| Problème | Solution |
|----------|----------|
| "Landing ne charge pas" | Attends 5 min (Vercel déploie) |
| "Paiement échoue" | Vérifie les secrets Stripe dans Supabase |
| "Webhook erreur 500" | Supabase > Logs > Edge Functions > stripe-webhook |
| "Email non reçu" | Supabase auth email doit être configuré |

---

**BONNE CHANCE ! 🚀**
