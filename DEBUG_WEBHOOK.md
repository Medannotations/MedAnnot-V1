# 🔧 Debug Webhook Stripe - Taux d'erreur 100%

## Vérifications rapides

### 1. Vérifier les variables d'environnement

Dans Supabase Dashboard → Project Settings → Functions → Secrets :

Doivent être présentes :
- ✅ `STRIPE_WEBHOOK_SECRET` = `whsec_...` (votre secret Stripe)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = clé service role (pas la anon key)
- ✅ `SUPABASE_URL` = `https://vbaaohcsmiaxbqcyfhhl.supabase.co`

**Si une variable manque, ajoutez-la !**

### 2. Vérifier les logs

Dans Supabase Dashboard → Functions → stripe-webhook → Logs :

Regardez les dernières erreurs. Messages courants :

#### "Missing Supabase environment variables"
→ Ajoutez `SUPABASE_SERVICE_ROLE_KEY` dans les secrets

#### "User not found"
→ L'email Stripe ne correspond à aucun utilisateur Supabase
→ Solution : Vérifiez que l'utilisateur s'est inscrit avec le même email

#### "Database update failed"
→ Problème de RLS ou de permissions
→ Solution : Vérifiez les policies RLS sur la table `profiles`

### 3. Vérifier la correspondance email

Dans Supabase SQL Editor :
```sql
-- Vérifier si l'email existe (recherche insensible à la casse)
SELECT email, user_id, subscription_status 
FROM profiles 
WHERE LOWER(email) = LOWER('email-utilisateur@exemple.com');
```

### 4. Tester manuellement

Créez un abonnement test et regardez les logs en temps réel :
1. Stripe Dashboard → Test mode
2. Créez un checkout
3. Payez avec carte test `4242 4242 4242 4242`
4. Regardez immédiatement les logs Supabase

### 5. Forcer la mise à jour manuelle (si webhook bloqué)

Si le webhook ne fonctionne pas, vous pouvez forcer l'activation :

```sql
-- Mettre à jour manuellement un utilisateur
UPDATE profiles 
SET 
  subscription_status = 'active',
  subscription_current_period_end = '2024-12-31T23:59:59Z',
  updated_at = NOW()
WHERE email = 'utilisateur@exemple.com';
```

## Configuration correcte des secrets

### Comment obtenir SUPABASE_SERVICE_ROLE_KEY :

1. Supabase Dashboard → Project Settings → API
2. Copiez **"service_role key"** (PAS la "anon key")
3. Cette clé permet d'outrepasser le RLS

### Comment obtenir STRIPE_WEBHOOK_SECRET :

1. Stripe Dashboard → Developers → Webhooks
2. Cliquez sur votre endpoint `MedAnnot`
3. Cliquez sur **"Reveal"** à côté de "Signing secret"
4. Copiez la valeur qui commence par `whsec_`

## Test complet

Après avoir configuré tout :

1. **Créer un utilisateur de test**
   - Inscrivez-vous sur votre app avec un email
   - Vérifiez qu'il apparaît dans la table `profiles`

2. **Créer un checkout Stripe**
   - Allez sur votre page d'abonnement
   - Choisissez un plan
   - Payez avec carte test

3. **Vérifier la mise à jour**
   ```sql
   SELECT email, subscription_status, stripe_customer_id 
   FROM profiles 
   WHERE email = 'votre-email@test.com';
   ```
   
   Doit afficher :
   - `subscription_status` = `active`
   - `stripe_customer_id` = `cus_...`

## Si ça ne marche toujours pas

1. **Vérifiez les logs Stripe**
   - Stripe Dashboard → Developers → Webhooks → votre endpoint
   - Cliquez sur un événement récent
   - Regardez la réponse (doit être HTTP 200)

2. **Vérifiez que la fonction est bien déployée**
   ```bash
   npx supabase functions list
   ```
   
3. **Redéployez la fonction**
   ```bash
   npx supabase functions deploy stripe-webhook
   ```

4. **Contactez-moi avec :**
   - Les logs d'erreur exacts
   - Le résultat de la requête SQL de vérification
