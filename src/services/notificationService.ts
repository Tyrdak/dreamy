// Service de notifications pour iOS et Android

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getAffirmation } from './affirmationAPI';

// Configuration des notifications
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
 * Demande les permissions de notifications
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
      
      if (newStatus !== 'granted') return false;
    }
    
    // Configuration Android
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
    
    return true;
  } catch (error) {
    return false;
  }
};

// ===== NOTIFICATION PROGRAMMABLE =====

export const scheduleCustomDailyNotification = async (hour: number, minute: number): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    
    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-reminder',
      content: {
        title: '🌙 Dreamy - Rappel',
        body: 'N\'oubliez pas de noter vos rêves ! Les souvenirs oniriques s\'effacent rapidement.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-reminder' },
        color: '#7c6df1',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

export const cancelDailyNotification = async (): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-reminder');
    return true;
  } catch (error) {
    return false;
  }
};

// ===== REALITY CHECKS =====

export const scheduleRandomRealityChecks = async (count: number = 5): Promise<boolean> => {
  try {
    await cancelRealityChecks();
    
    const messages = [
      'Êtes-vous en train de rêver ? 🌙 Regardez vos mains !',
      'Reality check ! 👀 Lisez un texte deux fois.',
      'Vérification : êtes-vous dans un rêve ? 🤔',
      'Lucidité check ! ✨ Sautez et voyez si vous flottez.',
      'Moment de conscience ! 🧠 Où étiez-vous il y a 5 minutes ?',
    ];
    
    const schedulePromises = [];
    for (let i = 0; i < count; i++) {
      const randomHour = Math.floor(Math.random() * (22 - 8) + 8);
      const randomMinute = Math.floor(Math.random() * 60);
      
      schedulePromises.push(
        Notifications.scheduleNotificationAsync({
          identifier: `reality-check-${i}`,
          content: {
            title: '✨ Reality Check',
            body: messages[i % messages.length],
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { type: 'reality-check' },
            color: '#fef08a',
            badge: 1,
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
    return true;
  } catch (error) {
    return false;
  }
};

export const cancelRealityChecks = async (): Promise<boolean> => {
  try {
    for (let i = 0; i < 10; i++) {
      await Notifications.cancelScheduledNotificationAsync(`reality-check-${i}`);
    }
    return true;
  } catch (error) {
    return false;
  }
};

// ===== AFFIRMATION DU JOUR =====

export const scheduleDailyQuote = async (): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-affirmation');
    
    const affirmation = await getAffirmation();
    
    await Notifications.scheduleNotificationAsync({
      identifier: 'daily-affirmation',
      content: {
        title: '✨ Affirmation du jour',
        body: String(affirmation),
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-affirmation' },
        color: '#a78bfa',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

export const cancelDailyAffirmation = async (): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily-affirmation');
    return true;
  } catch (error) {
    return false;
  }
};

// ===== UTILITAIRES =====

export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    return [];
  }
};

export const cancelAllNotifications = async (): Promise<boolean> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Envoie une notification de test
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
        body = 'N\'oubliez pas de noter vos rêves !';
        break;
      case 'lucid':
        title = '✨ Test - Reality Check';
        body = 'Êtes-vous en train de rêver ? Regardez vos mains !';
        break;
      case 'quote':
        const affirmation = await getAffirmation();
        console.log('🔍 Test - Affirmation:', affirmation);
        title = '✨ Test - Affirmation';
        body = String(affirmation);
        break;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: '#a78bfa',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Initialise toutes les notifications
 */
export const initializeNotifications = async (settings: {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  lucidModeEnabled: boolean;
  dailyQuoteEnabled: boolean;
}): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;
    
    await cancelAllNotifications();
    
    if (settings.dailyReminderEnabled) {
      const [hour, minute] = settings.dailyReminderTime.split(':').map(Number);
      await scheduleCustomDailyNotification(hour, minute);
    }
    
    if (settings.lucidModeEnabled) {
      await scheduleRandomRealityChecks(5);
    }
    
    if (settings.dailyQuoteEnabled) {
      await scheduleDailyQuote();
    }
    
    return true;
  } catch (error) {
    return false;
  }
};
