// Service pour gérer les notifications quotidiennes

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchAffirmation } from './affirmationsApi';

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Demande les permissions de notification
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission de notification refusée');
      return false;
    }
    
    // Configuration pour Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-affirmation', {
        name: 'Affirmation du matin',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7c6df1',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la demande de permissions:', error);
    return false;
  }
};

/**
 * Planifie la notification quotidienne du matin
 */
export const scheduleDailyMorningNotification = async () => {
  try {
    // Annule toutes les notifications précédentes
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Récupère une affirmation pour la notification de demain
    const affirmation = await fetchAffirmation();
    
    // Planifie une notification quotidienne à 8h du matin
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Votre affirmation du jour',
        body: affirmation,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-affirmation' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
    
    console.log('Notification quotidienne planifiée à 8h00');
    return true;
  } catch (error) {
    console.error('Erreur lors de la planification de la notification:', error);
    return false;
  }
};

/**
 * Initialise le système de notifications
 */
export const initializeNotifications = async (): Promise<boolean> => {
  const hasPermission = await requestNotificationPermissions();
  
  if (hasPermission) {
    await scheduleDailyMorningNotification();
    
    // Écoute les notifications reçues (pour rafraîchir l'affirmation dans l'app)
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });
    
    // Écoute les interactions avec les notifications
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response);
    });
    
    return true;
  }
  
  return false;
};

/**
 * Envoie une notification de test immédiate
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    // Vérifie les permissions d'abord
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.error('Permissions de notification non accordées');
      return false;
    }

    const affirmation = await fetchAffirmation();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Test de notification',
        body: affirmation,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    
    console.log('Notification de test planifiée dans 2 secondes');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de test:', error);
    return false;
  }
};

/**
 * Vérifie toutes les notifications planifiées
 */
export const getAllScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notifications planifiées:', scheduled);
    return scheduled;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return [];
  }
};

/**
 * Annule toutes les notifications
 */
export const cancelAllNotifications = async (): Promise<boolean> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Toutes les notifications annulées');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'annulation des notifications:', error);
    return false;
  }
};
