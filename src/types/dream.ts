// Types pour le journal de rêves

export type DreamType = 
  | 'cauchemar' 
  | 'lucide' 
  | 'ordinaire' 
  | 'récurrent' 
  | 'prémonitoire';

export type EmotionalState = 
  | 'joyeux' 
  | 'calme' 
  | 'anxieux' 
  | 'triste' 
  | 'excité' 
  | 'confus' 
  | 'neutre';

export type Tone = 'positive' | 'neutre' | 'négative';

export type SleepQuality = 
  | 'excellent' 
  | 'bon' 
  | 'moyen' 
  | 'mauvais' 
  | 'très mauvais';

export type MoonPhase = 
  | 'Nouvelle Lune' 
  | 'Premier Croissant' 
  | 'Premier Quartier' 
  | 'Lune Gibbeuse Croissante'
  | 'Pleine Lune' 
  | 'Lune Gibbeuse Décroissante' 
  | 'Dernier Quartier' 
  | 'Dernier Croissant';

export interface Dream {
  id: string;
  date: string; // ISO date string
  time: string; // ISO time string
  type: DreamType;
  title?: string;
  description: string;
  
  // États émotionnels
  emotionalStateBefore: EmotionalState;
  emotionalStateAfter: EmotionalState;
  emotionalIntensity: number; // 1-10
  
  // Détails du rêve
  characters: string[]; // Liste des personnages
  location: string;
  clarity: number; // 1-10
  tags: string[]; // Mots-clés
  
  // Analyse
  sleepQuality: SleepQuality;
  personalMeaning: string;
  tone: Tone;
  
  // Phase lunaire
  moonPhase?: MoonPhase;
  moonPhaseEmoji?: string;
  
  // Métadonnées
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface DreamFilters {
  type?: DreamType[];
  emotionalStateBefore?: EmotionalState[];
  emotionalStateAfter?: EmotionalState[];
  tone?: Tone[];
  tags?: string[];
  characters?: string[];
  moonPhase?: MoonPhase[];
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface DreamStatistics {
  totalDreams: number;
  dreamsByType: Record<DreamType, number>;
  dreamsByTone: Record<Tone, number>;
  dreamsByMoonPhase: Record<string, number>;
  averageClarity: number;
  averageIntensity: number;
  mostCommonEmotions: EmotionalState[];
  mostCommonTags: string[];
  mostCommonCharacters: string[];
}

