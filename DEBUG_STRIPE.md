# 🐛 DEBUG STRIPE - Secret correct mais erreur persiste

## Situation

✅ Secret `STRIPE_SECRET_KEY` est CORRECT : commence par `sk_test_51StDyP6...`
✅ Secret ajouté dans Supabase
✅ Fonction redéployée
❌ Erreur "Invalid URL" persiste

---

## Hypothèses

L'erreur "Invalid URL: An explicit scheme (such as https) must be provided." peut venir de :

1. **Version de Stripe incompatible** avec Deno
2. **httpClient non initialisé** correctement
3. **Problème avec l'import Stripe**

---

## ÉTAPES DE DEBUG

### Étape 1: Vérifier les logs

J'ai ouvert : https://app.supabase.com/project/vbaaohcsmiaxbqcyfhhl/logs/edge-functions

**Instructions :**
1. Cherche "stripe-checkout" dans les logs
2. Regarde les erreurs récentes (les plus en haut)
3. **Copie-colle l'erreur complète** avec le stack trace

### Étape 2: Tester avec une version différente de Stripe

Si les logs ne donnent pas assez d'info, on va modifier la fonction pour utiliser une version plus récente de Stripe.

---

## PENDANT CE TEMPS...

Laisse-moi créer une version corrigée de la fonction avec :
- Version plus récente de Stripe
- Meilleur handling des erreurs
- Debug logging

---

**VA SUR LES LOGS ET PARTAGE-MOI L'ERREUR COMPLÈTE !**
