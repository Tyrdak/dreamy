// Types pour l'API Moon

export interface MoonPhaseResponse {
  phase: {
    phase: string; // Nom de la phase
    value: number; // 0-1 (0 = nouvelle lune, 0.5 = pleine lune)
    angle: number; // Angle en degrés
    emoji: string; // Emoji représentant la phase
  };
  date: string;
}

export interface MoonPhaseData {
  phaseName: string;
  emoji: string;
  illumination: number; // Pourcentage d'illumination
}

// Mapping des phases lunaires
export const MOON_PHASES: Record<string, string> = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
};

export const MOON_PHASES_FR: Record<string, string> = {
  'New Moon': 'Nouvelle Lune',
  'Waxing Crescent': 'Premier Croissant',
  'First Quarter': 'Premier Quartier',
  'Waxing Gibbous': 'Lune Gibbeuse Croissante',
  'Full Moon': 'Pleine Lune',
  'Waning Gibbous': 'Lune Gibbeuse Décroissante',
  'Last Quarter': 'Dernier Quartier',
  'Waning Crescent': 'Dernier Croissant',
};

