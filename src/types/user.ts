// Types pour le profil utilisateur

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string; // URI ou emoji
  createdAt: string; // ISO date string
  
  // Préférences
  preferredNotificationTime?: string; // Format: "HH:mm"
  hasCompletedOnboarding: boolean;
}

export interface Settings {
  // Notifications
  notificationsEnabled: boolean;
  notificationTime: string; // Format: "HH:mm" (défaut: "08:00")
  dailyQuoteEnabled: boolean; // Citation du jour
  
  // Apparence
  theme: 'light' | 'dark' | 'auto';
  
  // Mode Lucide
  lucidModeEnabled: boolean;
  realityCheckFrequency: number; // heures (défaut: 4)
  
  // Données
  lastBackupDate?: string;
}

