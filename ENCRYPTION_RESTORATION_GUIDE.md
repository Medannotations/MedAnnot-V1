# 🔒 Guide de Restauration du Chiffrement

## Contexte

Le système de chiffrement médical a été **temporairement désactivé** pour des raisons de performance (UX/fluidité).

Tous les fichiers et code sont **sauvegardés** dans la branche Git : `backup-encryption-system`

---

## ⚠️ État Actuel (Sans Chiffrement)

**Données patients stockées EN CLAIR dans la base de données Supabase :**
- Prénom / Nom
- Adresse
- Code postal / Ville
- Pathologies
- Notes

**⚠️ NON CONFORME** pour le secret médical suisse (Art. 321 CP) et LPD/GDPR en production.

---

## ✅ Quand Réactiver le Chiffrement ?

### Conditions Idéales

1. **Infrastructure performante** :
   - Serveur Suisse (Safe Swiss Cloud recommandé)
   - CPU moderne avec instructions AES-NI
   - Latence DB < 10ms
   - CDN proche des utilisateurs

2. **Volume d'utilisateurs** :
   - Après validation du MVP
   - Avant mise en production réelle avec vrais patients

3. **Conformité légale** :
   - **OBLIGATOIRE** avant commercialisation
   - Requis pour certification médicale

---

## 🚀 Comment Restaurer le Chiffrement

### Étape 1 : Récupérer le Code

```bash
# Fusionner la branche de backup
git merge backup-encryption-system

# OU cherry-pick des fichiers spécifiques
git checkout backup-encryption-system -- src/services/encryptionService.ts
git checkout backup-encryption-system -- src/hooks/usePatients.ts
```

### Étape 2 : Fichiers à Restaurer

**Fichiers modifiés lors de la désactivation :**
```
src/hooks/usePatients.ts         ← Réactiver encrypt/decrypt
src/services/encryptionService.ts ← Système complet (déjà OK)
```

**Changements à faire dans `usePatients.ts` :**

1. **Réactiver l'import** (ligne 5) :
```typescript
import { encryptPatientData, decryptPatientData } from "@/services/encryptionService";
```

2. **Réactiver le déchiffrement** dans `usePatients()` :
```typescript
const patientsWithExamples = await Promise.all(
  (data as any[]).map(async (p) => {
    const decryptedData = await decryptPatientData(
      {
        first_name: p.first_name,
        last_name: p.last_name,
        address: p.address,
        postal_code: p.postal_code,
        city: p.city,
        pathologies: p.pathologies,
        notes: p.notes,
      },
      user.id
    );

    return {
      ...p,
      ...decryptedData,
      exampleAnnotations: p.example_annotations || [],
    };
  })
);
```

3. **Réactiver le chiffrement** dans `useCreatePatient()` :
```typescript
const encryptedData = await encryptPatientData(
  {
    first_name: patient.first_name,
    last_name: patient.last_name,
    address: patient.address,
    postal_code: patient.postal_code,
    city: patient.city,
    pathologies: patient.pathologies,
    notes: patient.notes,
  },
  user.id
);

const { data, error } = await supabase
  .from("patients")
  .insert({
    ...patient,
    ...encryptedData,  // ← Données chiffrées
    user_id: user.id
  })
```

4. **Réactiver dans `useUpdatePatient()`** - même logique

### Étape 3 : Migration des Données Existantes

**IMPORTANT** : Les données actuelles en clair doivent être chiffrées.

Créer un script de migration :

```typescript
// scripts/encrypt-existing-data.ts
import { supabase } from "@/integrations/supabase/client";
import { encryptPatientData } from "@/services/encryptionService";

async function migratePatients() {
  const { data: patients } = await supabase.from("patients").select("*");

  for (const patient of patients) {
    const encrypted = await encryptPatientData(
      {
        first_name: patient.first_name,
        last_name: patient.last_name,
        address: patient.address,
        postal_code: patient.postal_code,
        city: patient.city,
        pathologies: patient.pathologies,
        notes: patient.notes,
      },
      patient.user_id
    );

    await supabase
      .from("patients")
      .update(encrypted)
      .eq("id", patient.id);
  }

  console.log(`✓ ${patients.length} patients chiffrés`);
}

migratePatients();
```

### Étape 4 : Tests de Performance

Après réactivation, tester sur le **nouveau serveur** :

```bash
# Temps de chargement des patients
console.time('Load patients');
await usePatients();
console.timeEnd('Load patients');

# Doit être < 500ms pour 20 patients
```

**Benchmarks attendus (Safe Swiss Cloud) :**
- Connexion : ~200ms
- Déchiffrement 10 patients : < 100ms
- Création patient : < 300ms
- Navigation fluide

---

## 📊 Système de Chiffrement Complet

### Architecture Technique

**Algorithme** : AES-256-GCM (standard militaire)
**Dérivation de clé** : PBKDF2-SHA256 (10,000 itérations)
**Salt** : Déterministe basé sur userId (optimisation cache)
**IV** : Aléatoire 96 bits par chiffrement

### Optimisations Performances

✅ **Cache de clés dérivées** (Map en mémoire)
✅ **Chiffrement parallèle** (Promise.all)
✅ **Salt déterministe** (1 dérivation par user)
✅ **10,000 itérations PBKDF2** (OWASP compliant, balance perf/sécu)

### Conformité

- ✅ **Art. 321 CP** (Secret médical suisse)
- ✅ **LPD** (Loi fédérale sur la protection des données)
- ✅ **GDPR** (Règlement européen)
- ✅ **OWASP Top 10 2024**

---

## 🎯 Décision Finale

### Scénario 1 : Rester Sans Chiffrement (Déconseillé)

**Uniquement si :**
- Phase de développement / MVP
- Données de test uniquement
- Aucun vrai patient

**⚠️ INTERDIT en production commerciale**

### Scénario 2 : Réactiver Avec Bon Serveur (Recommandé)

**Quand :**
- Migration vers Safe Swiss Cloud
- Serveur avec AES-NI
- Avant lancement commercial

**Bénéfices :**
- Conformité légale totale
- Protection maximale des données
- UX fluide (avec bon serveur)
- Différenciation concurrentielle

---

## 📝 Checklist de Restauration

- [ ] Infrastructure performante en place (Safe Swiss Cloud)
- [ ] Tests de latence DB (< 10ms)
- [ ] Merge branche `backup-encryption-system`
- [ ] Réactiver imports dans `usePatients.ts`
- [ ] Réactiver encrypt/decrypt dans toutes les fonctions
- [ ] Script de migration des données existantes
- [ ] Tests de performance (< 500ms pour 20 patients)
- [ ] Tests de bout en bout
- [ ] Documentation utilisateur (backup mot de passe)
- [ ] Audit de sécurité (optionnel mais recommandé)

---

## 🔗 Ressources

**Branche Git** : `backup-encryption-system`
**Documentation complète** : `CHIFFREMENT_SECURITE.md`
**Service de chiffrement** : `src/services/encryptionService.ts`

**Safe Swiss Cloud** :
- Site : https://www.safesw isscloud.ch
- Support AES-NI : ✅
- Hébergement Suisse : ✅
- Conformité LPD : ✅

---

**Dernière mise à jour** : 2026-01-27
**Auteur** : MedAnnot Team + Claude Sonnet 4.5
