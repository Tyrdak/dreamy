# 🌟 Nouvelles Fonctionnalités - Dreamy v2.0

Toutes les nouvelles features immersives ajoutées à l'application Journal de Rêves !

## ✨ Fonctionnalités Implémentées

### 1. 🔥 Système de Streaks et Récompenses

**Compteur de jours consécutifs**
- ✅ Streak affiché sur le HomeScreen
- ✅ Mise à jour automatique à chaque nouveau rêve
- ✅ Record personnel sauvegardé
- ✅ Emojis évolutifs selon le nombre de jours
  - 🌑 0 jours - Commencer
  - 🌒 1-2 jours - Bon début
  - 🌓 3-6 jours - Continue
  - 🌔 7-13 jours - Incroyable
  - 🌕 14-29 jours - Excellent
  - ✨ 30-99 jours - Légendaire
  - 👑 100+ jours - Maître absolu

**Affichage**
- Carte gradient violet avec flame emoji
- Record personnel affiché
- Messages motivants adaptatifs

### 2. 🏆 Badges et Récompenses

**8 Badges à débloquer**
- 🌟 Premier Pas - Enregistrer 1er rêve
- 🔥 Rêveur Assidu - 7 jours de streak
- 🏆 Maître des Rêves - 30 jours de streak
- 👑 Légende Onirique - 100 jours de streak
- 🌕 Enfant de la Pleine Lune - 5 rêves en pleine lune
- ✨ Maître Lucide - 10 rêves lucides
- ⚔️ Guerrier des Cauchemars - 5 cauchemars
- 🔮 Analyste des Rêves - 50 rêves enregistrés

**Système de débloquage**
- Vérification automatique à chaque rêve ajouté
- Notification lors du débloquage
- Écran dédié pour voir tous les badges
- Badges lockés affichés en grisé

### 3. 🔔 Notifications Améliorées avec Phases Lunaires

**Notifications quotidiennes personnalisées**
- Emoji de la phase lunaire actuelle
- Message adapté à la phase :
  - 🌑 Nouvelle Lune : "Un nouveau cycle commence..."
  - 🌕 Pleine Lune : "La pleine lune illumine tes rêves..."
  - 🌓 Premier Quartier : "La lune croît..."
  - 🌗 Dernier Quartier : "Les rêves de cette nuit..."

**Calcul en temps réel**
- Phase lunaire récupérée au moment de la notification
- Messages motivants et poétiques
- Rappel doux pour noter ses rêves

### 4. 🌙 Journal Lunaire

**Analyse de l'influence lunaire**
- Rêves groupés par phase lunaire
- Phase préférée mise en évidence
- Statistiques par phase :
  - Nombre de rêves
  - Intensité moyenne
  - Clarté moyenne
  - Nombre de rêves lucides
  - Nombre de cauchemars
- Description poétique de chaque phase

**Insights**
- "Votre phase préférée" en hero card
- Statistiques comparatives
- Découverte de patterns lunaires

### 5. 💭 Citation Inspirante du Jour

**Service de citations**
- API externe (ZenQuotes) avec fallback local
- 8 citations locales pré-chargées
- Nouvelle citation chaque jour
- Stockage de la dernière citation

**Affichage**
- Carte gradient élégante
- Citation en italique
- Auteur affiché
- Bouton pour changer de citation

### 6. 🧘 Exercices de Respiration

**3 Exercices pré-configurés**
1. **4-7-8 (Relaxation)**
   - Inspire 4s, Retiens 7s, Expire 8s
   - Durée : 4 minutes

2. **Box Breathing**
   - Inspire 4s, Retiens 4s, Expire 4s
   - Durée : 3 minutes

3. **Cohérence Cardiaque**
   - Inspire 5s, Expire 5s
   - Durée : 5 minutes

**Features**
- Compteur de sessions réalisées
- Interface claire avec icônes
- Indication de durée et cycles
- Structure pour timer animé (à implémenter)

### 7. ⭐ Constellation de Rêves

**Visualisation graphique immersive**
- Chaque rêve = une étoile
- Taille = intensité émotionnelle
- Couleur = tonalité
  - 🟢 Vert : Positive
  - 🟣 Violet : Neutre
  - 🔴 Rouge : Négative
- Rêves lucides avec aura spéciale
- Positionnement pseudo-aléatoire harmonieux

**Interaction**
- Cliquer sur une étoile ouvre le rêve
- Statistiques en bas : étoiles, lucides, intensité moy.
- Design fond noir étoilé

### 8. 📊 Analyse de Mots-clés Récurrents

**Extraction intelligente**
- Top 20 mots les plus fréquents
- Exclusion des stop words français (le, la, de, etc.)
- Analyse des descriptions ET significations
- Affichage avec taille variable (nuage de mots)

**Thèmes prédéfinis**
- 🌊 Eau - mer, océan, rivière, pluie
- 🕊️ Vol - voler, ciel, nuages
- 🏃 Poursuite - courir, fuir, échapper
- 👨‍👩‍👧 Famille - mère, père, frère, sœur
- 🏠 Maison - chambre, appartement
- 📚 École/Travail - classe, bureau
- 🐾 Animaux - chien, chat, serpent
- 💀 Mort - mourir, décès

**Affichage**
- Compteur par thème
- Classement par fréquence
- Insights sur patterns récurrents

### 9. 📤 Export Avancé des Données

**3 formats d'export**

**1. Export JSON**
- Données structurées
- Métadonnées complètes
- Format machine-readable
- Parfait pour backup/import

**2. Export Texte (Journal)**
- Format lisible et imprimable
- Un rêve par page avec séparateurs
- Toutes les informations formatées
- Description complète et détails

**3. Export Statistiques**
- Analyse complète en texte
- Tous les chiffres clés
- Répartitions détaillées
- Format rapport

**Partage**
- Utilise `expo-sharing`
- Compatible iOS/Android
- Sauvegarde et partage
- Choix de l'application de destination

### 10. ✨ Mode Rêve Lucide

**Activation dans les Paramètres**
- Toggle simple ON/OFF
- Configuration de la fréquence (2h, 4h, 6h, 8h)

**Reality Checks**
- Notifications aléatoires dans la journée
- 8 questions variées :
  - "Es-tu en train de rêver ? Regarde tes mains"
  - "Vérification de réalité : lis ce texte deux fois"
  - "Essaie de voler"
  - etc.
- Timing aléatoire pour plus d'efficacité
- Aide à développer la lucidité

### 11. 📈 Statistiques Avancées (InsightsScreen)

**Nouvelles analyses**
- Mots-clés récurrents avec fréquence
- Thèmes automatiquement détectés
- Nuage de mots visuel
- Patterns de répétition

**Affichage enrichi**
- Taille de texte variable selon fréquence
- Icônes par thème
- Compteurs visuels
- Comparaisons temporelles

## 🛠️ Architecture Technique

### Nouveaux Types TypeScript
```typescript
- gamification.ts (DreamStreak, Badge, UserBadges)
- rituals.ts (DailyQuote, BreathingExercise, RitualsData)
- lucid.ts (LucidDreamSettings, RealityCheck)
```

### Nouveaux Services
```typescript
- quotesApi.ts (fetchDailyQuote, getRandomQuote)
- exportService.ts (exportDreamsAsJSON, exportDreamsAsText, exportStatsAsText)
- Notifications améliorées (scheduleDailyNotification avec phases, scheduleRealityChecks)
```

### Nouveau Stockage AsyncStorage
```typescript
- @dreamy:dream_streak (DreamStreak)
- @dreamy:user_badges (UserBadges)
- @dreamy:rituals (RitualsData)
```

### Nouveaux Écrans
1. **BadgesScreen** - Affichage des badges débloqués/lockés
2. **RitualsScreen** - Citations + exercices de respiration
3. **LunarJournalScreen** - Analyse lunaire détaillée
4. **ConstellationScreen** - Carte graphique des rêves

### Nouveaux Composants
- **StreakCard** - Carte de streak animée

### Nouveaux Utilitaires
- `analyzeKeywords()` - Extraction mots-clés
- `findRecurringThemes()` - Détection de thèmes
- `updateDreamStreak()` - Gestion du streak
- `checkAndUnlockBadges()` - Vérification badges

## 🎯 Comment Utiliser

### Voir votre Streak
- Ajoutez un rêve chaque jour
- Le streak apparaît automatiquement sur le HomeScreen
- Message motivant selon votre progression

### Débloquer des Badges
- Les badges se débloquent automatiquement
- Notification lors du débloquage
- Profil → "X Badges" pour tout voir

### Explorer les Nouvelles Features
Depuis le **Profil**, accédez à :
- ⭐ **Constellation de Rêves** - Visualisation graphique
- 🌙 **Journal Lunaire** - Influence de la lune
- 🧘 **Rituels du Sommeil** - Citations et respiration

### Activer le Mode Lucide
1. Profil → Paramètres
2. Section "Mode Rêve Lucide"
3. Activer le toggle
4. Choisir la fréquence (2-8h)
5. Recevoir des reality checks aléatoires

### Exporter vos Données
1. Profil → Paramètres → Données
2. "Exporter mes rêves" → Choisir format
3. "Exporter les statistiques" → Partager

## 🎨 Design & UX

Toutes les nouvelles features respectent :
- ✅ Palette de couleurs apaisante (violet/lavande/jaune lune)
- ✅ Animations fluides
- ✅ SafeArea pour iPhone
- ✅ Mode sombre compatible
- ✅ Messages chaleureux et humains
- ✅ Icônes expressives

## 📱 Navigation

Nouvelles routes Expo Router :
- `/badges` - Badges et récompenses
- `/rituals` - Rituels du sommeil
- `/lunar-journal` - Journal lunaire
- `/constellation` - Carte des rêves

## 🚀 Prochaines Améliorations

- [ ] Timer animé pour exercices de respiration
- [ ] Mode édition de rêve complet
- [ ] Graphiques SVG avancés
- [ ] Partage social de statistiques
- [ ] Synchronisation cloud optionnelle

---

**Dreamy v2.0** - Une expérience immersive et motivante pour explorer vos rêves ! 🌙✨

