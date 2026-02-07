# 🆕 Nouvelles Fonctionnalités : Signes Vitaux + Navigation GPS

## Résumé des ajouts

### 1. Signes Vitaux dans les Annotations
Chaque annotation peut maintenant inclure les constantes du patient :
- Température (°C)
- Pouls/Fréquence cardiaque (bpm)
- Tension artérielle (sys/dia mmHg)
- Fréquence respiratoire (rpm)
- Saturation O₂ (%)
- Glycémie (g/L)
- Échelle de douleur (0-10)
- État de conscience (AVPU)
- Poids et taille

### 2. Navigation GPS vers les Patients
- Bouton "Naviguer" sur chaque patient
- Détection automatique iPhone/Android
- Choix de l'application GPS (Google Maps, Waze, Plans, Mappy)
- Mémorisation de l'app préférée
- Ouverture directe dans l'app native ou web

### 3. Adresse détaillée des patients
- Rue
- Code postal
- Ville
- Pays (défaut: Suisse)

---

## 🔧 Étapes d'installation

### Étape 1 : Exécuter le SQL

Dans Supabase SQL Editor, exécutez le fichier `ADD_FEATURES_VITALS_GPS.sql` :

```sql
-- Cela ajoute :
-- - street, postal_code, city, country à la table patients
-- - vital_signs (JSONB) à la table annotations
```

### Étape 2 : Déployer les fonctions Edge (si modifiées)

```bash
npx supabase functions deploy generate-annotation
```

### Étape 3 : Push du code

```bash
git push origin main
```

---

## 📱 Utilisation

### Signes Vitaux

Lors de la création d'une annotation, une nouvelle section "Signes vitaux" apparaît :
1. Cliquez sur "Ajouter les constantes"
2. Remplissez les valeurs mesurées
3. Les anomalies sont colorées (vert/jaune/orange/rouge)
4. Les signes vitaux sont inclus dans l'annotation générée

### Navigation GPS

Sur la liste des patients ou dans le détail :
1. Cliquez sur l'icône 🧭 (Navigation)
2. Choisissez votre application GPS préférée
3. L'application s'ouvre avec l'adresse du patient
4. Votre choix est mémorisé pour la prochaine fois

---

## 🗄️ Structure des données

### Signes vitaux (JSONB)
```json
{
  "temperature": 37.2,
  "heartRate": 72,
  "systolicBP": 120,
  "diastolicBP": 80,
  "respiratoryRate": 16,
  "oxygenSaturation": 98,
  "bloodSugar": 0.95,
  "painLevel": 2,
  "consciousness": "alert",
  "weight": 70.5,
  "height": 170
}
```

### Adresse patient
```sql
street: "Rue de la Paix 12"
postal_code: "1202"
city: "Genève"
country: "Suisse"
```

---

## ⚠️ Notes importantes

1. **Chiffrement** : Les champs d'adresse sont chiffrés comme les autres données sensibles
2. **Signes vitaux** : Stockés en clair (JSONB) car ce sont des données médicales, pas des PII
3. **GPS** : Nécessite une adresse complète (rue + code postal + ville)
4. **Fallback** : Si l'app native ne s'ouvre pas, redirection vers la version web
