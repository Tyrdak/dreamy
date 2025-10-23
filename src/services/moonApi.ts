// Service pour récupérer les phases lunaires via l'API Moon

import { MoonPhaseData } from '../types/moon';

/**
 * API de phase lunaire gratuite
 * Documentation: https://www.icalendar37.net/lunar/api/
 */

const MOON_API_BASE_URL = 'https://api.farmsense.net/v1/moonphases';

/**
 * Calcule la phase lunaire pour une date donnée
 * Utilise un algorithme simplifié basé sur le cycle lunaire
 */
export const getMoonPhase = (date: Date): MoonPhaseData => {
  // Constantes du cycle lunaire
  const LUNAR_CYCLE = 29.53058867; // Jours du cycle lunaire
  const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z'); // Date de référence (nouvelle lune)
  
  // Calcul du nombre de jours depuis la nouvelle lune de référence
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  
  // Position dans le cycle lunaire (0 à 1)
  const cyclePosition = (daysSinceNewMoon % LUNAR_CYCLE) / LUNAR_CYCLE;
  
  // Pourcentage d'illumination
  const illumination = Math.abs(Math.cos(cyclePosition * 2 * Math.PI)) * 100;
  
  // Détermination de la phase
  let phaseName: string;
  let emoji: string;
  
  if (cyclePosition < 0.0625 || cyclePosition >= 0.9375) {
    phaseName = 'Nouvelle Lune';
    emoji = '🌑';
  } else if (cyclePosition < 0.1875) {
    phaseName = 'Premier Croissant';
    emoji = '🌒';
  } else if (cyclePosition < 0.3125) {
    phaseName = 'Premier Quartier';
    emoji = '🌓';
  } else if (cyclePosition < 0.4375) {
    phaseName = 'Lune Gibbeuse Croissante';
    emoji = '🌔';
  } else if (cyclePosition < 0.5625) {
    phaseName = 'Pleine Lune';
    emoji = '🌕';
  } else if (cyclePosition < 0.6875) {
    phaseName = 'Lune Gibbeuse Décroissante';
    emoji = '🌖';
  } else if (cyclePosition < 0.8125) {
    phaseName = 'Dernier Quartier';
    emoji = '🌗';
  } else {
    phaseName = 'Dernier Croissant';
    emoji = '🌘';
  }
  
  return {
    phaseName,
    emoji,
    illumination: Math.round(illumination),
  };
};

/**
 * Récupère la phase lunaire pour une date spécifique via l'API
 * Si l'API échoue, utilise l'algorithme local
 */
export const fetchMoonPhase = async (dateString: string): Promise<MoonPhaseData> => {
  try {
    const date = new Date(dateString);
    
    // Utilisation de l'algorithme local (plus fiable et hors ligne)
    return getMoonPhase(date);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la phase lunaire:', error);
    // En cas d'erreur, retourne une phase par défaut
    return {
      phaseName: 'Inconnue',
      emoji: '🌙',
      illumination: 0,
    };
  }
};

/**
 * Alternative: Récupère la phase lunaire via une API publique
 * API: https://api.farmsense.net/v1/moonphases/?d=TIMESTAMP
 */
export const fetchMoonPhaseFromAPI = async (dateString: string): Promise<MoonPhaseData | null> => {
  try {
    const date = new Date(dateString);
    const timestamp = Math.floor(date.getTime() / 1000);
    
    const response = await fetch(`${MOON_API_BASE_URL}/?d=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data = await response.json() as any[];
    
    if (data && data.length > 0) {
      const moonData = data[0];
      
      // Conversion de la phase en nom français
      const phaseValue = parseFloat(moonData.Phase);
      let phaseName: string;
      let emoji: string;
      
      if (phaseValue < 0.0625 || phaseValue >= 0.9375) {
        phaseName = 'Nouvelle Lune';
        emoji = '🌑';
      } else if (phaseValue < 0.1875) {
        phaseName = 'Premier Croissant';
        emoji = '🌒';
      } else if (phaseValue < 0.3125) {
        phaseName = 'Premier Quartier';
        emoji = '🌓';
      } else if (phaseValue < 0.4375) {
        phaseName = 'Lune Gibbeuse Croissante';
        emoji = '🌔';
      } else if (phaseValue < 0.5625) {
        phaseName = 'Pleine Lune';
        emoji = '🌕';
      } else if (phaseValue < 0.6875) {
        phaseName = 'Lune Gibbeuse Décroissante';
        emoji = '🌖';
      } else if (phaseValue < 0.8125) {
        phaseName = 'Dernier Quartier';
        emoji = '🌗';
      } else {
        phaseName = 'Dernier Croissant';
        emoji = '🌘';
      }
      
      return {
        phaseName,
        emoji,
        illumination: Math.round(parseFloat(moonData.Illumination) * 100),
      };
    }
    
    // Si pas de données, utilise l'algorithme local
    return getMoonPhase(date);
    
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Moon:', error);
    // En cas d'erreur, utilise l'algorithme local
    const date = new Date(dateString);
    return getMoonPhase(date);
  }
};

/**
 * Obtient le texte descriptif d'une phase lunaire
 */
export const getMoonPhaseDescription = (phaseName: string): string => {
  const descriptions: Record<string, string> = {
    'Nouvelle Lune': 'Un nouveau départ, idéal pour les intentions et les nouveaux projets.',
    'Premier Croissant': 'Une phase de croissance et d\'expansion de vos rêves.',
    'Premier Quartier': 'Un moment de décision et d\'action dans vos aspirations.',
    'Lune Gibbeuse Croissante': 'Une phase de raffinement et d\'amélioration.',
    'Pleine Lune': 'Illumination maximale, révélations et accomplissement.',
    'Lune Gibbeuse Décroissante': 'Une phase de gratitude et de partage.',
    'Dernier Quartier': 'Un moment de libération et de lâcher-prise.',
    'Dernier Croissant': 'Une phase de repos et de préparation au renouveau.',
  };
  
  return descriptions[phaseName] || 'Une phase mystérieuse de la lune.';
};

/**
 * Obtient les dates des prochaines pleines lunes
 */
export const getUpcomingFullMoons = (count: number = 3): Date[] => {
  const LUNAR_CYCLE = 29.53058867;
  const dates: Date[] = [];
  const today = new Date();
  
  // Trouve la prochaine pleine lune
  let currentDate = new Date(today);
  
  for (let i = 0; i < count * 30; i++) {
    const phase = getMoonPhase(currentDate);
    if (phase.phaseName === 'Pleine Lune' && dates.length < count) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + LUNAR_CYCLE);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return dates;
};

