# Charte Graphique MedAnnot

## Identité Visuelle

### Positionnement
MedAnnot est un outil professionnel pour infirmiers indépendants suisses. L'identité doit refléter :
- **Confiance** : Sécurité des données médicales (LPD suisse)
- **Efficacité** : Gain de temps immédiat
- **Proximité** : Compréhension du quotidien des infirmiers
- **Professionnalisme** : Standards médicaux suisses élevés

### Palette de Couleurs

#### Couleurs Primaires
- **Bleu Médical** : `#2563eb` (blue-600) - Confiance, professionnalisme
- **Bleu Foncé** : `#1d4ed8` (blue-700) - Titres, emphase
- **Bleu Clair** : `#3b82f6` (blue-500) - Hover, accents

#### Couleurs Secondaires
- **Émeraude** : `#10b981` (emerald-500) - Santé, succès, CTA principal
- **Émeraude Foncé** : `#059669` (emerald-600) - Hover CTA
- **Émeraude Clair** : `#34d399` (emerald-400) - Badges, highlights

#### Couleurs de Support
- **Rouge Corail** : `#ef4444` (red-500) - Urgence, problèmes (section Problem)
- **Jaune** : `#eab308` (yellow-500) - Attention, badges
- **Gris** : `#6b7280` (gray-500) - Texte secondaire
- **Gris Clair** : `#f3f4f6` (gray-100) - Fonds de section

#### Couleurs Neutres
- **Noir** : `#111827` (gray-900) - Titres
- **Blanc** : `#ffffff` - Fonds principaux
- **Gris Bordure** : `#e5e7eb` (gray-200) - Bordures légères

### Typographie

#### Titres
- **Font** : Système sans-serif (Tailwind default)
- **H1** : text-4xl md:text-5xl lg:text-6xl, font-bold
- **H2** : text-3xl md:text-4xl lg:text-5xl, font-bold
- **H3** : text-xl md:text-2xl, font-bold

#### Corps de Texte
- **Font** : Système sans-serif
- **Taille** : text-base (16px) minimum
- **Couleur** : text-gray-600 à text-gray-700
- **Interligne** : leading-relaxed (1.625)

### Composants UI

#### Boutons

**Bouton Primaire (CTA)**
```
Class: bg-gradient-to-r from-emerald-500 to-emerald-600 
       hover:from-emerald-600 hover:to-emerald-700 
       text-white font-semibold rounded-xl shadow-lg
Usage: Essai gratuit, Démarrer
```

**Bouton Secondaire (Connexion)**
```
Class: bg-white border-2 border-gray-300 
       hover:border-blue-400 hover:text-blue-600 
       text-gray-800 font-semibold rounded-xl
Usage: Se connecter
```

**Bouton Outline**
```
Class: border-2 border-gray-300 hover:border-blue-500 
       text-gray-700 hover:text-blue-600
Usage: Actions secondaires
```

#### Cards
- **Fond** : bg-white
- **Bordure** : border-2 border-gray-100
- **Radius** : rounded-2xl
- **Ombre** : hover:shadow-lg transition

#### Badges

**Badge Recommandé**
```
Class: bg-gradient-to-r from-emerald-500 to-emerald-600 
       text-white px-4 py-1.5 rounded-full text-sm font-bold
```

**Badge Info**
```
Class: bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full
```

### Espacement

#### Sections
- **Padding vertical** : py-12 md:py-20
- **Padding horizontal** : px-4 (mobile), container mx-auto (desktop)

#### Composants
- **Gap entre éléments** : gap-4 à gap-8
- **Padding interne cards** : p-5 md:p-6

### Responsive Design

#### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

#### Règles
- Touch targets minimum : 44px (min-h-[44px])
- Grids : 1 colonne mobile → 2-3 colonnes desktop
- Textes : Réduire de 1 niveau sur mobile (lg→md, md→base)

### Icônes
- **Librairie** : Lucide React
- **Taille standard** : w-5 h-5 (inline), w-6 h-6 (buttons)
- **Couleur** : Hérite du parent ou couleur thème

### Animation

#### Transitions
- **Durée** : duration-300
- **Timing** : ease-out

#### Hover Effects
- **Cards** : hover:shadow-lg hover:border-gray-200
- **Boutons** : hover:scale-[1.02] ou hover:shadow-xl
- **Liens** : hover:text-blue-600 hover:underline

### Principes UX

1. **Clarté avant tout** : Pas de texte sur fond sombre sans contraste suffisant
2. **Hiérarchie visuelle** : Les CTA doivent être les plus visibles
3. **Feedback immédiat** : Hover states sur tous les éléments cliquables
4. **Contexte local** : Adapter le vocabulaire (suisse romand, LPD)
5. **Confiance** : Badges sécurité visibles, mentions LPD apparentes

### Pages Spécifiques

#### Landing Page
- Hero avec social proof immédiate
- Section Problem/Solution émotionnelle
- Pricing avec "0 CHF aujourd'hui" très visible

#### Inscription
- Gros badge "0 CHF aujourd'hui" en haut
- Date de fin d'essai calculée dynamiquement
- Explication claire du prélèvement différé

#### Dashboard
- Interface épurée, focus sur l'essentiel
- Actions principales bien visibles
- Feedback visuel sur les actions

### Accessibilité
- Contraste minimum 4.5:1 pour le texte
- Focus visible sur tous les éléments interactifs
- Alt text sur toutes les images
- ARIA labels où nécessaire
