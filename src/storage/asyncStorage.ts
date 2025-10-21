// Utilitaires AsyncStorage pour gérer le stockage local

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVAILABLE_BADGES, Dream, DreamStreak, ExerciseSession, ExerciseStreak, RitualsData, Settings, UserBadges, UserProfile } from '../types';

// Clés de stockage
const STORAGE_KEYS = {
  DREAMS: '@dreamy:dreams',
  USER_PROFILE: '@dreamy:user_profile',
  SETTINGS: '@dreamy:settings',
  ONBOARDING_COMPLETED: '@dreamy:onboarding_completed',
  DREAM_STREAK: '@dreamy:dream_streak',
  USER_BADGES: '@dreamy:user_badges',
  RITUALS: '@dreamy:rituals',
} as const;

// ===== GESTION DES RÊVES =====

/**
 * Récupère tous les rêves stockés
 */
export const getDreams = async (): Promise<Dream[]> => {
  try {
    const dreamsJson = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
    if (!dreamsJson) return [];
    return JSON.parse(dreamsJson);
  } catch (error) {
    console.error('Erreur lors de la récupération des rêves:', error);
    return [];
  }
};

/**
 * Récupère un rêve par son ID
 */
export const getDreamById = async (id: string): Promise<Dream | null> => {
  try {
    const dreams = await getDreams();
    return dreams.find(dream => dream.id === id) || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rêve:', error);
    return null;
  }
};

/**
 * Récupère tous les tags uniques utilisés dans les rêves
 */
export const getAllUsedTags = async (): Promise<string[]> => {
  try {
    const dreams = await getDreams();
    const allTags = dreams.flatMap(dream => dream.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    return [];
  }
};

/**
 * Sauvegarde un nouveau rêve et met à jour le streak/badges
 */
export const saveDream = async (dream: Dream): Promise<{ success: boolean; streak?: DreamStreak; newBadges?: string[] }> => {
  try {
    const dreams = await getDreams();
    dreams.push(dream);
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
    
    // Met à jour le streak
    const updatedStreak = await updateDreamStreak(dream.date);
    
    // Vérifie et débloque les badges
    const newBadges = await checkAndUnlockBadges();
    
    return { 
      success: true, 
      streak: updatedStreak,
      newBadges: newBadges.length > 0 ? newBadges : undefined,
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du rêve:', error);
    return { success: false };
  }
};

/**
 * Met à jour un rêve existant
 */
export const updateDream = async (updatedDream: Dream): Promise<boolean> => {
  try {
    const dreams = await getDreams();
    const index = dreams.findIndex(dream => dream.id === updatedDream.id);
    
    if (index === -1) return false;
    
    dreams[index] = {
      ...updatedDream,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rêve:', error);
    return false;
  }
};

/**
 * Supprime un rêve par son ID
 */
export const deleteDream = async (id: string): Promise<boolean> => {
  try {
    const dreams = await getDreams();
    const filteredDreams = dreams.filter(dream => dream.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(filteredDreams));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du rêve:', error);
    return false;
  }
};

/**
 * Supprime tous les rêves
 */
export const deleteAllDreams = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les rêves:', error);
    return false;
  }
};

// ===== GESTION DU PROFIL UTILISATEUR =====

/**
 * Récupère le profil utilisateur
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!profileJson) return null;
    return JSON.parse(profileJson);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};

/**
 * Sauvegarde ou met à jour le profil utilisateur
 */
export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error);
    return false;
  }
};

/**
 * Met à jour partiellement le profil utilisateur
 */
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const profile = await getUserProfile();
    if (!profile) return false;
    
    const updatedProfile = { ...profile, ...updates };
    return await saveUserProfile(updatedProfile);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return false;
  }
};

// ===== GESTION DES PARAMÈTRES =====

/**
 * Paramètres par défaut
 */
const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true,
  notificationTime: '08:00',
  theme: 'auto',
  lucidModeEnabled: false,
  realityCheckFrequency: 4,
};

/**
 * Récupère les paramètres
 */
export const getSettings = async (): Promise<Settings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settingsJson) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Sauvegarde les paramètres
 */
export const saveSettings = async (settings: Settings): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
    return false;
  }
};

/**
 * Met à jour partiellement les paramètres
 */
export const updateSettings = async (updates: Partial<Settings>): Promise<boolean> => {
  try {
    const settings = await getSettings();
    const updatedSettings = { ...settings, ...updates };
    return await saveSettings(updatedSettings);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return false;
  }
};

// ===== GESTION DE L'ONBOARDING =====

/**
 * Vérifie si l'onboarding a été complété
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'onboarding:', error);
    return false;
  }
};

/**
 * Marque l'onboarding comme complété
 */
export const setOnboardingCompleted = async (completed: boolean): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'onboarding:', error);
    return false;
  }
};

// ===== UTILITAIRES =====

/**
 * Réinitialise toutes les données
 */
export const resetAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.DREAMS,
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      STORAGE_KEYS.DREAM_STREAK,
      STORAGE_KEYS.USER_BADGES,
      STORAGE_KEYS.RITUALS,
    ]);
    return true;
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des données:', error);
    return false;
  }
};

/**
 * Exporte toutes les données en JSON
 */
export const exportAllData = async (): Promise<string | null> => {
  try {
    const [dreams, profile, settings, streak, badges, rituals] = await Promise.all([
      getDreams(),
      getUserProfile(),
      getSettings(),
      getDreamStreak(),
      getUserBadges(),
      getRitualsData(),
    ]);
    
    const data = {
      dreams,
      profile,
      settings,
      streak,
      badges,
      rituals,
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erreur lors de l\'export des données:', error);
    return null;
  }
};

// ===== GESTION DES STREAKS =====

/**
 * Streak par défaut
 */
const DEFAULT_STREAK: DreamStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastDreamDate: null,
  streakStartDate: null,
};

/**
 * Récupère le streak actuel
 */
export const getDreamStreak = async (): Promise<DreamStreak> => {
  try {
    const streakJson = await AsyncStorage.getItem(STORAGE_KEYS.DREAM_STREAK);
    if (!streakJson) return DEFAULT_STREAK;
    return JSON.parse(streakJson);
  } catch (error) {
    console.error('Erreur lors de la récupération du streak:', error);
    return DEFAULT_STREAK;
  }
};

/**
 * Met à jour le streak
 */
export const updateDreamStreak = async (dreamDate: string): Promise<DreamStreak> => {
  try {
    const currentStreak = await getDreamStreak();
    const today = new Date(dreamDate).toISOString().split('T')[0];
    const lastDate = currentStreak.lastDreamDate 
      ? new Date(currentStreak.lastDreamDate).toISOString().split('T')[0]
      : null;

    let newStreak = { ...currentStreak };

    if (!lastDate) {
      // Premier rêve
      newStreak = {
        currentStreak: 1,
        longestStreak: 1,
        lastDreamDate: today,
        streakStartDate: today,
      };
    } else if (lastDate === today) {
      // Même jour, pas de changement
      return currentStreak;
    } else {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const daysDiff = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Jour consécutif
        newStreak = {
          currentStreak: currentStreak.currentStreak + 1,
          longestStreak: Math.max(currentStreak.longestStreak, currentStreak.currentStreak + 1),
          lastDreamDate: today,
          streakStartDate: currentStreak.streakStartDate,
        };
      } else {
        // Streak cassé
        newStreak = {
          currentStreak: 1,
          longestStreak: currentStreak.longestStreak,
          lastDreamDate: today,
          streakStartDate: today,
        };
      }
    }

    await AsyncStorage.setItem(STORAGE_KEYS.DREAM_STREAK, JSON.stringify(newStreak));
    return newStreak;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du streak:', error);
    return DEFAULT_STREAK;
  }
};

// ===== GESTION DES BADGES =====

/**
 * Récupère les badges de l'utilisateur
 */
export const getUserBadges = async (): Promise<UserBadges> => {
  try {
    const badgesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_BADGES);
    if (!badgesJson) {
      return {
        badges: AVAILABLE_BADGES,
        totalUnlocked: 0,
      };
    }
    return JSON.parse(badgesJson);
  } catch (error) {
    console.error('Erreur lors de la récupération des badges:', error);
    return {
      badges: AVAILABLE_BADGES,
      totalUnlocked: 0,
    };
  }
};

/**
 * Débloque un badge
 */
export const unlockBadge = async (badgeId: string): Promise<boolean> => {
  try {
    const userBadges = await getUserBadges();
    const badgeIndex = userBadges.badges.findIndex(b => b.id === badgeId);
    
    if (badgeIndex === -1 || userBadges.badges[badgeIndex].isUnlocked) {
      return false;
    }

    userBadges.badges[badgeIndex] = {
      ...userBadges.badges[badgeIndex],
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
    };
    
    userBadges.totalUnlocked = userBadges.badges.filter(b => b.isUnlocked).length;

    await AsyncStorage.setItem(STORAGE_KEYS.USER_BADGES, JSON.stringify(userBadges));
    return true;
  } catch (error) {
    console.error('Erreur lors du débloquage du badge:', error);
    return false;
  }
};

/**
 * Vérifie et débloque les badges selon les rêves
 */
export const checkAndUnlockBadges = async (): Promise<string[]> => {
  try {
    const [dreams, streak] = await Promise.all([getDreams(), getDreamStreak()]);
    const newlyUnlocked: string[] = [];

    // Premier rêve
    if (dreams.length >= 1) {
      const unlocked = await unlockBadge('first_dream');
      if (unlocked) newlyUnlocked.push('first_dream');
    }

    // Streaks
    if (streak.currentStreak >= 7) {
      const unlocked = await unlockBadge('week_streak');
      if (unlocked) newlyUnlocked.push('week_streak');
    }
    if (streak.currentStreak >= 30) {
      const unlocked = await unlockBadge('month_streak');
      if (unlocked) newlyUnlocked.push('month_streak');
    }
    if (streak.currentStreak >= 100) {
      const unlocked = await unlockBadge('100_days');
      if (unlocked) newlyUnlocked.push('100_days');
    }

    // Types de rêves
    const lucidDreams = dreams.filter(d => d.type === 'lucide').length;
    if (lucidDreams >= 10) {
      const unlocked = await unlockBadge('lucid_master');
      if (unlocked) newlyUnlocked.push('lucid_master');
    }

    const nightmares = dreams.filter(d => d.type === 'cauchemar').length;
    if (nightmares >= 5) {
      const unlocked = await unlockBadge('nightmare_warrior');
      if (unlocked) newlyUnlocked.push('nightmare_warrior');
    }

    // Total de rêves
    if (dreams.length >= 50) {
      const unlocked = await unlockBadge('dream_analyst');
      if (unlocked) newlyUnlocked.push('dream_analyst');
    }

    // Pleines lunes
    const fullMoonDreams = dreams.filter(d => d.moonPhase === 'Pleine Lune').length;
    if (fullMoonDreams >= 5) {
      const unlocked = await unlockBadge('full_moon_dreamer');
      if (unlocked) newlyUnlocked.push('full_moon_dreamer');
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Erreur lors de la vérification des badges:', error);
    return [];
  }
};

// ===== GESTION DES RITUELS =====

/**
 * Rituels par défaut
 */
const DEFAULT_RITUALS: RitualsData = {
  exerciseStreak: {
    currentStreak: 0,
    longestStreak: 0,
    lastExerciseDate: null,
    totalSessions: 0,
  },
  completedExercises: [],
};

/**
 * Récupère les données des rituels
 */
export const getRitualsData = async (): Promise<RitualsData> => {
  try {
    const ritualsJson = await AsyncStorage.getItem(STORAGE_KEYS.RITUALS);
    if (!ritualsJson) return DEFAULT_RITUALS;
    
    const parsed = JSON.parse(ritualsJson);
    
    // Migration : ajoute exerciseStreak si manquant
    if (!parsed.exerciseStreak) {
      parsed.exerciseStreak = DEFAULT_RITUALS.exerciseStreak;
    }
    if (!parsed.completedExercises) {
      parsed.completedExercises = [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Erreur lors de la récupération des rituels:', error);
    return DEFAULT_RITUALS;
  }
};

/**
 * Sauvegarde les données des rituels
 */
export const saveRitualsData = async (data: RitualsData): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RITUALS, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des rituels:', error);
    return false;
  }
};

/**
 * Met à jour la citation du jour
 */
export const updateDailyQuote = async (quote: any): Promise<boolean> => {
  try {
    const rituals = await getRitualsData();
    rituals.dailyQuote = quote;
    rituals.lastQuoteDate = new Date().toISOString();
    return await saveRitualsData(rituals);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la citation:', error);
    return false;
  }
};

/**
 * Enregistre une session d'exercice complétée
 */
export const completeExerciseSession = async (exerciseId: string, duration: number): Promise<ExerciseStreak> => {
  try {
    const rituals = await getRitualsData();
    const today = new Date().toISOString().split('T')[0];
    
    // Ajoute la session
    const session: ExerciseSession = {
      exerciseId,
      date: today,
      completed: true,
      duration,
    };
    
    rituals.completedExercises = rituals.completedExercises || [];
    rituals.completedExercises.push(session);

    // Met à jour le streak
    const lastDate = rituals.exerciseStreak.lastExerciseDate 
      ? new Date(rituals.exerciseStreak.lastExerciseDate).toISOString().split('T')[0]
      : null;

    if (!lastDate || lastDate !== today) {
      // Nouvelle session aujourd'hui
      const daysDiff = lastDate
        ? Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (daysDiff === 1 || !lastDate) {
        // Jour consécutif ou premier jour
        rituals.exerciseStreak.currentStreak = (rituals.exerciseStreak.currentStreak || 0) + 1;
        rituals.exerciseStreak.longestStreak = Math.max(
          rituals.exerciseStreak.longestStreak || 0,
          rituals.exerciseStreak.currentStreak
        );
      } else if (daysDiff > 1) {
        // Streak cassé
        rituals.exerciseStreak.currentStreak = 1;
      }

      rituals.exerciseStreak.lastExerciseDate = today;
      rituals.exerciseStreak.totalSessions = (rituals.exerciseStreak.totalSessions || 0) + 1;
    }

    await saveRitualsData(rituals);
    return rituals.exerciseStreak;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la session:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastExerciseDate: null,
      totalSessions: 0,
    };
  }
};

