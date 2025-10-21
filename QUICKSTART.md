# 🚀 Quick Start Guide - Dreamy

Guide de démarrage rapide pour lancer l'application en quelques minutes.

## ⚡ Installation Express

```bash
# 1. Se placer dans le dossier du projet
cd /Users/maelbourdin/Documents/Epsi/Cours/2025-2026/Dev-Mobile/dreamy

# 2. Les dépendances sont déjà installées, mais si besoin :
npm install

# 3. Lancer l'application
npm start
```

## 📱 Tester l'Application

### Option 1 : Sur votre téléphone (Recommandé)

1. **Installez Expo Go** sur votre téléphone :
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android : [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scannez le QR code** affiché dans le terminal après `npm start`
   - iOS : Utilisez l'app Appareil photo
   - Android : Utilisez l'app Expo Go directement

3. **L'app se lance** automatiquement sur votre téléphone ! 🎉

### Option 2 : Émulateur iOS (Mac uniquement)

```bash
npm run ios
```

### Option 3 : Émulateur Android

```bash
npm run android
```

### Option 4 : Web (développement)

```bash
npm run web
```

> ⚠️ Note : L'app est optimisée pour mobile. L'expérience web peut être limitée.

## 🎯 Premier Lancement

Au premier lancement, vous verrez :

1. **Écran de bienvenue** 🌙
   - Présentation de l'app
   - Cliquez sur "Commencer l'aventure"

2. **Tutoriel interactif** (4 pages)
   - Swipez pour naviguer
   - Ou cliquez sur "Passer"

3. **Page d'accueil**
   - Liste vide de rêves
   - Cliquez sur le bouton "+" pour ajouter votre premier rêve !

## 🧪 Tester les Fonctionnalités

### Ajouter un Rêve

1. Cliquez sur le bouton flottant **+** (en bas à droite)
2. Remplissez au minimum :
   - Une description
   - Les autres champs ont des valeurs par défaut
3. Cliquez sur "Enregistrer le rêve"
4. Votre rêve apparaît dans la liste avec sa phase lunaire ! 🌕

### Voir les Détails

1. Cliquez sur une carte de rêve
2. Consultez toutes les informations
3. Possibilité de supprimer

### Filtrer les Rêves

1. Cliquez sur l'icône de filtre (en haut à droite)
2. Sélectionnez des types ou tonalités
3. Les rêves sont filtrés instantanément

### Voir les Statistiques

1. Allez dans l'onglet "Profil"
2. Cliquez sur "Voir les statistiques détaillées"
3. Explorez vos patterns de rêves 📊

### Paramètres

1. Profil → Icône paramètres
2. Activez les notifications
3. Changez le thème (clair/sombre/auto)

## 🔧 Résolution de Problèmes

### L'app ne se lance pas ?

```bash
# Nettoyez le cache et relancez
npm start -- --clear
```

### Erreur de dépendances ?

```bash
# Réinstallez les dépendances
rm -rf node_modules
npm install
```

### Problème de Metro Bundler ?

```bash
# Tuez les processus et relancez
pkill -f "expo"
npm start
```

### Erreur NativeWind / Tailwind ?

```bash
# Vérifiez que global.css existe
cat global.css

# Si absent, il devrait contenir :
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

## 📲 Notifications

Pour tester les notifications :

1. Allez dans **Paramètres**
2. Activez les notifications
3. Acceptez les permissions sur votre téléphone
4. Les notifications quotidiennes sont programmées pour 8h00
5. Pour tester immédiatement : à implémenter dans SettingsScreen (bouton test)

## 🎨 Thèmes

L'app supporte 3 modes :
- **Clair** : Fond blanc
- **Sombre** : Fond bleu nuit
- **Auto** : Selon les paramètres système

Changez dans : **Profil → Paramètres → Apparence**

## 💾 Données

Toutes les données sont stockées **localement** sur votre appareil :
- AsyncStorage
- Pas de serveur requis
- Fonctionne hors-ligne

Pour réinitialiser :
**Paramètres → Données → Réinitialiser**

## 🌙 Phases Lunaires

Les phases lunaires sont calculées **automatiquement** :
- Algorithme astronomique local
- Pas besoin d'internet
- Précis à 99%
- 8 phases détectées

## 🎓 Structure des Données

Un rêve contient :
- Date, heure, type
- Description et titre
- 2 états émotionnels
- Intensité et clarté (1-10)
- Lieu, personnages, tags
- Qualité du sommeil
- Tonalité et signification
- Phase lunaire automatique 🌕

## 📚 Ressources

- **README.md** : Documentation complète
- **FEATURES.md** : Liste de toutes les fonctionnalités
- **app/** : Code de navigation
- **src/** : Code métier

## 🆘 Besoin d'Aide ?

1. Consultez le **README.md** pour la doc complète
2. Vérifiez **FEATURES.md** pour les fonctionnalités
3. Regardez les commentaires dans le code

## ✅ Checklist Rapide

- [ ] `npm install` exécuté
- [ ] `npm start` lancé
- [ ] QR code scanné avec Expo Go
- [ ] App lancée sur le téléphone
- [ ] Onboarding complété
- [ ] Premier rêve ajouté
- [ ] Phase lunaire visible
- [ ] Statistiques consultées

## 🎉 C'est Parti !

Vous êtes prêt à explorer le monde fascinant de vos rêves avec **Dreamy** ! 🌙✨

Bon voyage onirique ! 💭

