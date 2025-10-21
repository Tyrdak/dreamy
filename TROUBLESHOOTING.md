# 🔧 Guide de Dépannage - Dreamy

## 🎨 Problème : Pas de CSS / Styles ne s'appliquent pas

### Symptômes
- Les styles Tailwind ne s'appliquent pas
- L'interface est toute blanche ou sans mise en forme
- Message d'erreur lié à NativeWind

### Solution

#### 1. Vérifiez que tous les fichiers de configuration existent

Assurez-vous que ces fichiers sont présents :

- ✅ `global.css` (contient les directives Tailwind)
- ✅ `tailwind.config.js` (configuration Tailwind)
- ✅ `babel.config.js` (avec preset NativeWind)
- ✅ `metro.config.js` (configuration Metro avec NativeWind)
- ✅ `nativewind-env.d.ts` (types TypeScript)

#### 2. Nettoyez le cache

```bash
# Supprimez les caches
rm -rf .expo node_modules/.cache

# Relancez l'app avec le cache vidé
npm start -- --clear
```

#### 3. Vérifiez que global.css est importé

Dans `app/_layout.tsx`, vous devez avoir :
```typescript
import "../global.css";
```

#### 4. Redémarrez complètement

```bash
# Tuez tous les processus Expo/Metro
pkill -f "expo"
pkill -f "metro"

# Relancez
npm start -- --clear
```

## 📱 Problème : L'app ne démarre pas

### Solution 1 : Réinstallez les dépendances

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Solution 2 : Vérifiez la version de Node

```bash
node --version  # Devrait être >= 18
```

Si votre version est inférieure à 18, mettez à jour Node.js.

### Solution 3 : Vérifiez Expo CLI

```bash
npx expo --version
```

## 🔔 Problème : Notifications ne fonctionnent pas

### Sur iOS
1. Les notifications ne fonctionnent **pas** dans le simulateur iOS
2. Testez sur un **vrai appareil iOS**
3. Acceptez les permissions quand demandées

### Sur Android
1. Vérifiez que vous avez accepté les permissions
2. Allez dans Paramètres → Applications → Dreamy → Notifications
3. Activez les notifications

### Dans Expo Go
Les notifications locales fonctionnent dans Expo Go, mais avec des limitations.

## 💾 Problème : Les données ne sont pas sauvegardées

### Solution
1. Vérifiez AsyncStorage :
```bash
# Réinstallez AsyncStorage
npm install @react-native-async-storage/async-storage
```

2. Vérifiez les permissions :
   - AsyncStorage devrait fonctionner sans permissions spéciales
   - Si problème, réinitialisez l'app (désinstallez et réinstallez)

## 🌙 Problème : Phase lunaire incorrecte

### Vérification
La phase lunaire est calculée localement avec un algorithme astronomique.

Si elle semble incorrecte :
1. Vérifiez la date du rêve (format ISO correct)
2. L'algorithme a une précision de ~99%
3. Comparez avec un calendrier lunaire en ligne

## 🎨 Problème : Mode sombre ne fonctionne pas

### Solution
1. Allez dans **Profil → Paramètres → Apparence**
2. Changez le thème manuellement
3. En mode "Auto", le thème suit les paramètres système

Pour forcer un thème :
```typescript
// Dans les paramètres
theme: 'dark' // ou 'light' ou 'auto'
```

## 📊 Problème : Statistiques vides

### Cause
Vous n'avez pas encore de rêves enregistrés.

### Solution
1. Ajoutez au moins un rêve via le bouton "+"
2. Les statistiques se calculent automatiquement
3. Plus vous avez de rêves, plus les stats sont intéressantes

## 🔄 Problème : Erreur Metro Bundler

### Solution complète

```bash
# 1. Tuez tous les processus
pkill -f "expo"
pkill -f "metro"
pkill -f "node"

# 2. Nettoyez tout
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

# 3. Relancez
npm start -- --clear
```

## 🐛 Problème : Erreur TypeScript

### Erreurs courantes

#### "Cannot find module 'nativewind'"
```bash
npm install nativewind tailwindcss
```

#### "Property 'className' does not exist"
Vérifiez que `nativewind-env.d.ts` existe et est inclus dans `tsconfig.json`.

#### Erreurs d'import
```bash
# Réinstaller les types
npm install --save-dev @types/react @types/react-native
```

## 📱 Problème : Expo Go ne scanne pas le QR code

### iOS
- Utilisez l'app **Appareil photo** (pas Expo Go)
- Le QR code devrait ouvrir automatiquement Expo Go

### Android
- Utilisez l'app **Expo Go** directement
- Appuyez sur "Scan QR Code"

### Alternative
Dans le terminal, après `npm start`, appuyez sur :
- `i` pour iOS simulator
- `a` pour Android emulator
- `w` pour web

## 🔄 Réinitialisation Complète (Last Resort)

Si rien ne fonctionne :

```bash
# 1. Nettoyage total
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json
rm -rf ios/Pods  # si vous avez un dossier ios

# 2. Réinstallation
npm install

# 3. Cache propre
npm start -- --clear
```

## 🆘 Toujours bloqué ?

### Vérifications finales

1. **Version de Node** : >= 18
```bash
node --version
```

2. **Version d'Expo** : ~54.0
```bash
npx expo --version
```

3. **Packages installés** :
```bash
npm list nativewind tailwindcss @react-native-async-storage/async-storage
```

4. **Port Metro** : Vérifiez que le port 8081 est libre
```bash
lsof -i :8081  # Si occupé, tuez le processus
```

### Fichiers de log

Les logs sont dans :
- Metro : Terminal où vous avez lancé `npm start`
- Expo Go : Secouez l'appareil → "View Logs"

## 📞 Support

Si le problème persiste :
1. Consultez la documentation Expo : https://docs.expo.dev/
2. Documentation NativeWind : https://www.nativewind.dev/
3. GitHub Issues du projet

## ✅ Checklist de Démarrage

Avant de démarrer l'app, vérifiez :

- [ ] Node.js >= 18 installé
- [ ] `npm install` exécuté sans erreurs
- [ ] `metro.config.js` existe
- [ ] `global.css` existe
- [ ] `nativewind-env.d.ts` existe
- [ ] Aucun processus Metro ne tourne déjà
- [ ] Port 8081 disponible
- [ ] Expo Go installé sur le téléphone (ou émulateur configuré)

## 🎉 L'app fonctionne ?

Si tout marche maintenant :
1. Profitez de Dreamy ! 🌙
2. Commencez à noter vos rêves
3. Explorez les statistiques

---

**Note** : La plupart des problèmes se résolvent avec un simple `npm start -- --clear` 😊

