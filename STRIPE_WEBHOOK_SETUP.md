# Configuration Webhook Stripe

## Étape 1 : Déployer la Edge Function

```bash
npx supabase functions deploy stripe-webhook
```

## Étape 2 : Configurer les variables d'environnement

Dans Supabase Dashboard → Project Settings → Functions :

Ajoutez ces secrets :
- `STRIPE_WEBHOOK_SECRET` : À récupérer après création du webhook dans Stripe
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (pas la anon key)

## Étape 3 : Créer le webhook dans Stripe

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. URL du endpoint :
   ```
   https://vbaaohcsmiaxbqcyfhhl.supabase.co/functions/v1/stripe-webhook
   ```
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.canceled`

5. Cliquez sur **"Add endpoint"**
6. Copiez le **"Signing secret"** (commence par `whsec_`)

## Étape 4 : Ajouter le secret dans Supabase

Dans Supabase Dashboard → Project Settings → Functions :
- Ajoutez : `STRIPE_WEBHOOK_SECRET` = `whsec_...` (le secret copié)

## Étape 5 : Tester

1. Créez un checkout de test
2. Complétez le paiement
3. Vérifiez dans Supabase que le profil est mis à jour :
   ```sql
   SELECT subscription_status, stripe_customer_id 
   FROM profiles 
   WHERE email = 'votre-email@test.com';
   ```

## Dépannage

### Le webhook ne fonctionne pas ?

1. Vérifiez les logs dans Supabase :
   - Functions → stripe-webhook → Logs

2. Vérifiez dans Stripe :
   - Developers → Webhooks → votre endpoint → Recent events

3. Testez localement :
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

### L'abonnement ne s'affiche pas ?

Vérifiez que :
- Le webhook est bien créé dans Stripe
- Le secret `STRIPE_WEBHOOK_SECRET` est correctement configuré
- La Edge Function est déployée sans erreur
- Les logs Supabase montrent la réception des événements
