// Types pour la gamification (streaks, badges, etc.)

export interface DreamStreak {
  currentStreak: number;
  longestStreak: number;
  lastDreamDate: string | null; // ISO date string
  streakStartDate: string | null; // ISO date string
}

export type BadgeType =
  | 'first_dream'
  | 'week_streak'
  | 'month_streak'
  | '100_days'
  | 'full_moon_dreamer'
  | 'lucid_master'
  | 'nightmare_warrior'
  | 'dream_analyst';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: string; // ISO date string
  isUnlocked: boolean;
}

export interface UserBadges {
  badges: Badge[];
  totalUnlocked: number;
}

// Badges disponibles
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_dream',
    name: 'Premier Pas',
    description: 'Enregistrer votre premier rêve',
    emoji: '🌟',
    isUnlocked: false,
  },
  {
    id: 'week_streak',
    name: 'Rêveur Assidu',
    description: '7 jours consécutifs de rêves',
    emoji: '🔥',
    isUnlocked: false,
  },
  {
    id: 'month_streak',
    name: 'Maître des Rêves',
    description: '30 jours consécutifs de rêves',
    emoji: '🏆',
    isUnlocked: false,
  },
  {
    id: '100_days',
    name: 'Légende Onirique',
    description: '100 jours de streak',
    emoji: '👑',
    isUnlocked: false,
  },
  {
    id: 'full_moon_dreamer',
    name: 'Enfant de la Pleine Lune',
    description: 'Rêver pendant 5 pleines lunes',
    emoji: '🌕',
    isUnlocked: false,
  },
  {
    id: 'lucid_master',
    name: 'Maître Lucide',
    description: 'Enregistrer 10 rêves lucides',
    emoji: '✨',
    isUnlocked: false,
  },
  {
    id: 'nightmare_warrior',
    name: 'Guerrier des Cauchemars',
    description: 'Surmonter 5 cauchemars',
    emoji: '⚔️',
    isUnlocked: false,
  },
  {
    id: 'dream_analyst',
    name: 'Analyste des Rêves',
    description: 'Enregistrer 50 rêves',
    emoji: '🔮',
    isUnlocked: false,
  },
];

