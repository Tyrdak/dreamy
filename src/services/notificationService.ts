// Service de notifications pour iOS et Android

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchDailyQuote } from './quotesApi';

// Configuration pour afficher les notifications même en premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Demande les permissions de notifications (iOS et Android)
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      if (newStatus !== 'granted') {
        console.log('❌ Permissions de notification refusées');
        return false;
      }
    }
    
    // Configuration pour Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Notifications Dreamy',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7c6df1',
        sound: 'default',
      });
      
      await Notifications.setNotificationChannelAsync('lucid-checks', {
        name: 'Reality Checks',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#fef08a',
        sound: 'default',
      });
    }
    
    console.log('✅ Permissions de notification accordées');
    return true;
  } catch (error) {
    console.error('Erreur permissions:', error);
    return false;
  }
};

// ===== 1. NOTIFICATION PROGRAMMABLE =====

/**
 * Planifie une notification à une heure précise chaque jour
 */
export const scheduleCustomDailyNotification = async (hour: number, minute: number): Promise<boolean> => {
  try {
    console.log(`📅 Planification notification quotidienne à ${hour}:${minute}`);
    
    // Annule l'ancienne notification quotidienne
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    
    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-reminder',
      content: {
        title: '🌙 Dreamy - Rappel',
        body: 'N\'oubliez pas de noter vos rêves ! Les souvenirs oniriques s\'effacent rapidement.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
    
    console.log('✅ Notification quotidienne planifiée');
    return true;
  } catch (error) {
    console.error('❌ Erreur planification quotidienne:', error);
    return false;
  }
};

/**
 * Annule la notification quotidienne
 */
export const cancelDailyNotification = async (): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    console.log('✅ Notification quotidienne annulée');
    return true;
  } catch (error) {
    console.error('❌ Erreur annulation:', error);
    return false;
  }
};

// ===== 2. REALITY CHECKS (MODE LUCIDE) =====

/**
 * Planifie des reality checks aléatoires dans la journée
 */
export const scheduleRandomRealityChecks = async (count: number = 5): Promise<boolean> => {
  try {
    console.log(`🎲 Planification de ${count} reality checks aléatoires`);
    
    // Annule les anciens reality checks
    await cancelRealityChecks();
    
    const realityCheckMessages = [
      'Êtes-vous en train de rêver ? 🌙 Regardez vos mains !',
      'Reality check ! 👀 Lisez un texte deux fois.',
      'Vérification : êtes-vous dans un rêve ? 🤔',
      'Lucidité check ! ✨ Sautez et voyez si vous flottez.',
      'Moment de conscience ! 🧠 Où étiez-vous il y a 5 minutes ?',
    ];
    
    // Génère des heures aléatoires entre 8h et 22h
    const schedulePromises = [];
    for (let i = 0; i < count; i++) {
      const randomHour = Math.floor(Math.random() * (22 - 8) + 8); // Entre 8h et 22h
      const randomMinute = Math.floor(Math.random() * 60);
      
      schedulePromises.push(
        Notifications.scheduleNotificationAsync({
          identifier: `reality-check-${i}`,
          content: {
            title: '✨ Reality Check',
            body: realityCheckMessages[i % realityCheckMessages.length],
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { type: 'reality-check' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: randomHour,
            minute: randomMinute,
            repeats: true,
          },
        })
      );
    }
    
    await Promise.all(schedulePromises);
    console.log('✅ Reality checks planifiés');
    return true;
  } catch (error) {
    console.error('❌ Erreur reality checks:', error);
    return false;
  }
};

/**
 * Annule tous les reality checks
 */
export const cancelRealityChecks = async (): Promise<boolean> => {
  try {
    // Annule tous les reality checks (0 à 9 pour être sûr)
    for (let i = 0; i < 10; i++) {
      await Notifications.cancelScheduledNotificationAsync(`reality-check-${i}`);
    }
    console.log('✅ Reality checks annulés');
    return true;
  } catch (error) {
    console.error('❌ Erreur annulation reality checks:', error);
    return false;
  }
};

// ===== 3. CITATION DU JOUR =====

/**
 * Planifie la citation quotidienne à 8h du matin
 */
export const scheduleDailyQuote = async (): Promise<boolean> => {
  try {
    console.log('💬 Planification citation du jour à 8h00');
    
    // Annule l'ancienne
    await Notifications.cancelScheduledNotificationAsync('daily-quote');
    
    // Récupère une citation
    const quote = await fetchDailyQuote();
    
    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-quote',
      content: {
        title: '💭 Citation du jour',
        body: `"${quote.text}" - ${quote.author}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        data: { type: 'daily-quote' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
    
    console.log('✅ Citation quotidienne planifiée');
    return true;
  } catch (error) {
    console.error('❌ Erreur citation quotidienne:', error);
    return false;
  }
};

/**
 * Annule la citation quotidienne
 */
export const cancelDailyQuote = async (): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-quote');
    console.log('✅ Citation quotidienne annulée');
    return true;
  } catch (error) {
    console.error('❌ Erreur annulation citation:', error);
    return false;
  }
};

// ===== UTILITAIRES =====

/**
 * Récupère toutes les notifications planifiées
 */
export const getAllScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 ${scheduled.length} notification(s) planifiée(s)`);
    return scheduled;
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    return [];
  }
};

/**
 * Annule toutes les notifications
 */
export const cancelAllNotifications = async (): Promise<boolean> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Toutes les notifications annulées');
    return true;
  } catch (error) {
    console.error('❌ Erreur annulation:', error);
    return false;
  }
};

/**
 * Envoie une notification de test immédiate
 */
export const sendTestNotification = async (type: 'daily' | 'lucid' | 'quote'): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;
    
    let title = '';
    let body = '';
    
    switch (type) {
      case 'daily':
        title = '🌙 Test - Rappel quotidien';
        body = 'Ceci est un test de votre rappel quotidien. N\'oubliez pas de noter vos rêves !';
        break;
      case 'lucid':
        title = '✨ Test - Reality Check';
        body = 'Êtes-vous en train de rêver ? Regardez vos mains !';
        break;
      case 'quote':
        const quote = await fetchDailyQuote();
        title = '💭 Test - Citation du jour';
        body = `"${quote.text}" - ${quote.author}`;
        break;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    
    console.log(`✅ Notification test "${type}" envoyée`);
    return true;
  } catch (error) {
    console.error('❌ Erreur test:', error);
    return false;
  }
};

/**
 * Initialise toutes les notifications selon les paramètres
 */
export const initializeNotifications = async (settings: {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // Format "HH:mm"
  lucidModeEnabled: boolean;
  dailyQuoteEnabled: boolean;
}): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;
    
    // Annule tout d'abord
    await cancelAllNotifications();
    
    // 1. Notification quotidienne personnalisée
    if (settings.dailyReminderEnabled) {
      const [hour, minute] = settings.dailyReminderTime.split(':').map(Number);
      await scheduleCustomDailyNotification(hour, minute);
    }
    
    // 2. Reality checks aléatoires
    if (settings.lucidModeEnabled) {
      await scheduleRandomRealityChecks(5);
    }
    
    // 3. Citation du jour
    if (settings.dailyQuoteEnabled) {
      await scheduleDailyQuote();
    }
    
    console.log('✅ Notifications initialisées');
    return true;
  } catch (error) {
    console.error('❌ Erreur initialisation notifications:', error);
    return false;
  }
};

