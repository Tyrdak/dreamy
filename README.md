# 🌙 Dreamy - Journal de Rêves

Une application mobile React Native complète et immersive pour enregistrer, analyser et comprendre vos rêves. Dreamy vous aide à explorer votre monde intérieur grâce à l'analyse de vos expériences oniriques et leur lien avec les phases lunaires.

![Dreamy Banner](https://img.shields.io/badge/React%20Native-0.81-blue) ![Expo](https://img.shields.io/badge/Expo-~54.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales

- **Onboarding Immersif** : Introduction complète expliquant les bienfaits de noter ses rêves et le lien avec la lune
- **Formulaire Complet de Rêve** : Enregistrez vos rêves avec de nombreux détails :
  - Date et heure du rêve
  - Type de rêve (cauchemar, lucide, ordinaire, récurrent, prémonitoire)
  - États émotionnels (avant/après le sommeil)
  - Intensité émotionnelle et clarté (sliders 1-10)
  - Personnages, lieu, tags personnalisés
  - Qualité du sommeil
  - Signification personnelle
  - Tonalité globale

- **Phase Lunaire Automatique** 🌕 : Intégration automatique de la phase lunaire du jour via calcul astronomique
- **Liste et Recherche** : Consultez tous vos rêves avec filtres avancés (type, tonalité, tags, etc.)
- **Détails Complets** : Vue détaillée de chaque rêve avec toutes les informations
- **Statistiques Avancées** 📊 : 
  - Nombre total de rêves
  - Répartition par type et tonalité
  - Clarté et intensité moyennes
  - Émotions récurrentes
  - Tags populaires
  - Distribution par phase lunaire

- **Profil Utilisateur** : Avatar, statistiques personnelles, préférences
- **Paramètres Complets** :
  - Activation/désactivation des notifications
  - Choix du thème (clair/sombre/auto)
  - Export des données
  - Réinitialisation complète

- **Notifications Quotidiennes** 🔔 : Rappels personnalisables pour noter vos rêves

### 🎨 Design & UX

- Interface moderne et apaisante avec palette de couleurs douce (bleu nuit, violet, blanc cassé)
- Animations fluides et transitions douces
- Mode sombre/clair automatique
- Icônes expressives (Ionicons)
- Design responsive et intuitif
- Gestion des états de chargement et erreurs

## 🛠️ Stack Technique

- **Framework** : React Native (Expo ~54.0)
- **Router** : Expo Router (navigation file-based)
- **Styling** : NativeWind (Tailwind CSS pour React Native)
- **Storage** : AsyncStorage (stockage local)
- **Notifications** : Expo Notifications
- **Language** : TypeScript
- **Date Handling** : date-fns
- **Icons** : Expo Vector Icons (Ionicons)
- **API** : Calcul astronomique des phases lunaires

## 📦 Installation

### Prérequis

- Node.js (v18+)
- npm ou yarn
- Expo CLI
- Un appareil iOS/Android ou un émulateur

### Étapes d'installation

1. **Cloner le projet**
```bash
cd dreamy
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application**

Pour iOS :
```bash
npm run ios
```

Pour Android :
```bash
npm run android
```

Pour le web (développement) :
```bash
npm run web
```

4. **Démarrer le serveur de développement**
```bash
npm start
```

## 📁 Structure du Projet

```
dreamy/
├── app/                          # Navigation Expo Router
│   ├── (tabs)/                   # Onglets principaux
│   │   ├── index.tsx            # Liste des rêves
│   │   ├── add.tsx              # Ajout rapide
│   │   ├── insights.tsx         # Statistiques
│   │   └── profile.tsx          # Profil
│   ├── _layout.tsx              # Layout principal
│   ├── welcome.tsx              # Page d'accueil
│   ├── onboarding.tsx           # Tutoriel
│   ├── add-dream.tsx            # Formulaire complet
│   ├── dream-details.tsx        # Détails d'un rêve
│   ├── profile.tsx              # Profil (stack)
│   ├── settings.tsx             # Paramètres
│   └── insights.tsx             # Stats détaillées
│
├── src/
│   ├── components/              # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Slider.tsx
│   │   ├── TagChip.tsx
│   │   ├── Picker.tsx
│   │   └── DreamCard.tsx
│   │
│   ├── screens/                 # Écrans de l'application
│   │   ├── WelcomeScreen.tsx
│   │   ├── OnboardingTutorialScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── AddDreamScreen.tsx
│   │   ├── DreamDetailsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── InsightsScreen.tsx
│   │
│   ├── services/                # Services externes
│   │   ├── moonApi.ts          # API phases lunaires
│   │   └── notificationService.ts
│   │
│   ├── storage/                 # Gestion AsyncStorage
│   │   └── asyncStorage.ts
│   │
│   ├── types/                   # Types TypeScript
│   │   ├── dream.ts
│   │   ├── user.ts
│   │   ├── moon.ts
│   │   └── index.ts
│   │
│   └── utils/                   # Utilitaires
│       └── dreamUtils.ts
│
├── assets/                      # Images et ressources
├── tailwind.config.js          # Configuration Tailwind
├── babel.config.js             # Configuration Babel
└── package.json

```

## 🎯 Fonctionnement de chaque écran

### 1. WelcomeScreen
Écran d'accueil présentant l'application avec :
- Logo et titre animés
- Description des fonctionnalités principales
- Bouton pour commencer

### 2. OnboardingTutorialScreen
Tutoriel interactif avec 4 pages :
- Pourquoi noter ses rêves
- Le lien avec la lune
- Comment utiliser l'app
- Suivi de l'évolution

### 3. HomeScreen
Écran principal avec :
- Liste de tous les rêves (DreamCard)
- Barre de recherche
- Filtres avancés (type, tonalité, tags)
- Bouton flottant d'ajout
- Pull-to-refresh

### 4. AddDreamScreen
Formulaire complet pour ajouter un rêve :
- Tous les champs détaillés
- Validation des données
- Calcul automatique de la phase lunaire
- Sauvegarde dans AsyncStorage

### 5. DreamDetailsScreen
Vue détaillée d'un rêve avec :
- Toutes les informations du rêve
- Phase lunaire et description
- Boutons éditer/supprimer
- Navigation facile

### 6. ProfileScreen
Profil utilisateur avec :
- Avatar et nom
- Statistiques rapides
- Répartition par types
- Tonalités
- Tags populaires

### 7. SettingsScreen
Paramètres de l'application :
- Gestion des notifications
- Choix du thème
- Export des données
- Réinitialisation

### 8. InsightsScreen
Statistiques détaillées avec :
- Vue d'ensemble
- Graphiques par type
- Analyse des tonalités
- Distribution lunaire
- Émotions et thèmes récurrents

## 🌙 API Moon - Phases Lunaires

L'application utilise un **algorithme astronomique local** pour calculer les phases lunaires. Cela garantit :
- **Fonctionnement hors-ligne** complet
- **Précision** des calculs
- **Aucune dépendance** à un service externe
- **Performance** optimale

### Algorithme utilisé

L'algorithme se base sur :
- Cycle lunaire de 29.53 jours
- Date de référence (nouvelle lune connue)
- Calcul de la position dans le cycle
- Détermination de la phase correspondante

### Phases détectées

- 🌑 Nouvelle Lune
- 🌒 Premier Croissant
- 🌓 Premier Quartier
- 🌔 Lune Gibbeuse Croissante
- 🌕 Pleine Lune
- 🌖 Lune Gibbeuse Décroissante
- 🌗 Dernier Quartier
- 🌘 Dernier Croissant

## 💾 Stockage Local (AsyncStorage)

Toutes les données sont stockées localement avec AsyncStorage :

### Données stockées

1. **Rêves** (`@dreamy:dreams`)
   - Tableau de tous les rêves
   - Format JSON complet

2. **Profil utilisateur** (`@dreamy:user_profile`)
   - Nom, avatar, préférences
   - Date de création

3. **Paramètres** (`@dreamy:settings`)
   - Notifications activées
   - Heure des rappels
   - Thème choisi

4. **Onboarding** (`@dreamy:onboarding_completed`)
   - État de complétion du tutoriel

### Fonctions disponibles

```typescript
// Rêves
getDreams(): Promise<Dream[]>
saveDream(dream: Dream): Promise<boolean>
updateDream(dream: Dream): Promise<boolean>
deleteDream(id: string): Promise<boolean>

// Profil
getUserProfile(): Promise<UserProfile>
saveUserProfile(profile: UserProfile): Promise<boolean>

// Paramètres
getSettings(): Promise<Settings>
updateSettings(settings: Partial<Settings>): Promise<boolean>

// Export
exportAllData(): Promise<string>
resetAllData(): Promise<boolean>
```

## 🔔 Notifications

Le système de notifications utilise Expo Notifications :

### Configuration

```typescript
// Demander la permission
await requestNotificationPermissions();

// Programmer une notification quotidienne
await scheduleDailyNotification(8, 0); // 8h00

// Annuler toutes les notifications
await cancelAllNotifications();
```

### Notifications programmées

- **Rappel quotidien** : "As-tu rêvé cette nuit ?"
- Heure personnalisable dans les paramètres
- Compatible iOS et Android

## 🎨 Design System (NativeWind)

### Palette de couleurs

```javascript
primary: {
  600: '#7c6df1',  // Violet principal
  // ... autres nuances
}

dream: {
  night: '#1e1b4b',    // Bleu nuit
  dusk: '#312e81',     // Crépuscule
  purple: '#6d28d9',   // Violet foncé
  lavender: '#a78bfa', // Lavande
  moon: '#fef08a',     // Jaune lune
  cloud: '#f8fafc',    // Blanc cassé
}
```

### Composants réutilisables

- **Button** : Variants (primary, secondary, outline, ghost, danger)
- **Input** : Champs de texte avec label et validation
- **Slider** : Curseurs pour valeurs numériques
- **TagChip** : Tags sélectionnables et supprimables
- **Picker** : Sélecteur modal avec recherche
- **DreamCard** : Carte de rêve avec toutes les infos

## 📱 Captures d'écran

### Onboarding & Welcome
- Écran d'accueil chaleureux
- Tutoriel en 4 étapes

### Liste des Rêves
- Cartes magnifiques
- Filtres puissants
- Recherche instantanée

### Ajout de Rêve
- Formulaire complet
- UX fluide
- Validation en temps réel

### Statistiques
- Graphiques clairs
- Analyses détaillées
- Insights pertinents

## 🚀 Choix Techniques

### Pourquoi React Native + Expo ?
- Développement rapide cross-platform
- Écosystème riche (notifications, storage, etc.)
- Hot reload pour développement efficace
- Build et déploiement simplifiés

### Pourquoi NativeWind ?
- Syntaxe Tailwind familière
- Performance native
- Thème dynamique (dark mode)
- Maintenance simplifiée

### Pourquoi AsyncStorage ?
- Stockage local simple et efficace
- Pas besoin de serveur
- Fonctionne hors-ligne
- Données privées et sécurisées

### Pourquoi TypeScript ?
- Type-safety pour éviter les erreurs
- Autocomplétion dans l'IDE
- Refactoring sûr
- Documentation vivante

## 🧪 Tests et Développement

### Lancer l'app en développement

```bash
npm start
```

Puis scannez le QR code avec Expo Go (iOS/Android)

### Réinitialiser le cache

```bash
npm start -- --clear
```

### Build production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 🔮 Fonctionnalités futures

- [ ] Mode d'édition de rêve
- [ ] Import de données JSON
- [ ] Partage de rêves
- [ ] Rappels personnalisés multiples
- [ ] Recherche avancée avec filtres combinés
- [ ] Export PDF des rêves
- [ ] Mode lecture avec ambiance sonore
- [ ] Citation inspirante du jour
- [ ] Graphiques plus avancés
- [ ] Synchronisation cloud (optionnelle)

## 🤝 Contribution

Ce projet est un projet éducatif pour EPSI. Les contributions sont les bienvenues !

## 📄 Licence

MIT License - Libre d'utilisation et de modification

## 👨‍💻 Auteur

Développé avec 💜 pour le cours de Dev Mobile 2025-2026 - EPSI

---

**Dreamy** - Explorez l'univers fascinant de vos rêves 🌙✨
