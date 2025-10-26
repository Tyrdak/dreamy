// Types pour les rituels du sommeil

export interface DailyQuote {
  text: string;
  author: string;
  date: string; // ISO date string
}

export type ExerciseType = 'respiration' | 'meditation' | 'visualisation' | 'relaxation';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  description: string;
  duration: number;
  difficulty: 'facile' | 'moyen' | 'avancé';
  benefits: string[];
  inhale?: number;
  hold?: number;
  exhale?: number;
  steps?: string[];
}

export const EXERCISES: Exercise[] = [
  // Respiration
  {
    id: 'breathing_478',
    name: '4-7-8 Relaxation',
    type: 'respiration',
    description: 'Technique de respiration pour s\'endormir rapidement et calmer l\'anxiété',
    duration: 240,
    difficulty: 'facile',
    benefits: ['Réduit l\'anxiété', 'Facilite l\'endormissement', 'Calme le système nerveux'],
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    id: 'breathing_box',
    name: 'Box Breathing',
    type: 'respiration',
    description: 'Respiration carrée utilisée par les Navy SEALs pour gérer le stress',
    duration: 240,
    difficulty: 'facile',
    benefits: ['Améliore la concentration', 'Réduit le stress', 'Équilibre le système nerveux'],
    inhale: 4,
    hold: 4,
    exhale: 4,
  },
  {
    id: 'breathing_coherence',
    name: 'Cohérence Cardiaque',
    type: 'respiration',
    description: 'Synchronisation du rythme cardiaque avec la respiration',
    duration: 300,
    difficulty: 'facile',
    benefits: ['Réduit la tension', 'Améliore le sommeil', 'Régule les émotions'],
    inhale: 5,
    hold: 0,
    exhale: 5,
  },
  {
    id: 'breathing_alternate',
    name: 'Nadi Shodhana (Respiration alternée)',
    type: 'respiration',
    description: 'Respiration par narines alternées, technique de yoga',
    duration: 300,
    difficulty: 'moyen',
    benefits: ['Équilibre les hémisphères', 'Calme l\'esprit', 'Prépare au sommeil'],
    inhale: 4,
    hold: 4,
    exhale: 4,
  },
  {
    id: 'breathing_ocean',
    name: 'Respiration Océanique',
    type: 'respiration',
    description: 'Respiration profonde pour visualiser les vagues',
    duration: 420,
    difficulty: 'facile',
    benefits: ['Profondément relaxant', 'Favorise la visualisation', 'Calme les pensées'],
    inhale: 6,
    hold: 2,
    exhale: 8,
  },
  
  // Méditation
  {
    id: 'meditation_body_scan',
    name: 'Body Scan',
    type: 'meditation',
    description: 'Scanner votre corps pour relâcher les tensions',
    duration: 600,
    difficulty: 'facile',
    benefits: ['Détente musculaire', 'Conscience corporelle', 'Meilleur sommeil'],
    steps: [
      'Allongez-vous confortablement',
      'Fermez les yeux',
      'Portez attention à vos pieds',
      'Remontez progressivement vers la tête',
      'Relâchez chaque partie du corps',
    ],
  },
  {
    id: 'meditation_gratitude',
    name: 'Gratitude du Soir',
    type: 'meditation',
    description: 'Méditation de gratitude pour finir la journée positivement',
    duration: 300,
    difficulty: 'facile',
    benefits: ['Pensées positives', 'Meilleure humeur', 'Rêves plus doux'],
    steps: [
      'Pensez à 3 choses positives du jour',
      'Ressentez la gratitude',
      'Respirez profondément',
      'Laissez la paix vous envahir',
    ],
  },
  {
    id: 'meditation_counting',
    name: 'Méditation des 100',
    type: 'meditation',
    description: 'Compter à rebours de 100 pour calmer le mental',
    duration: 300,
    difficulty: 'moyen',
    benefits: ['Apaise le mental', 'Facilite l\'endormissement', 'Concentration'],
    steps: [
      'Commencez à 100',
      'Comptez à rebours lentement',
      'Visualisez chaque nombre',
      'Si vous vous perdez, recommencez',
    ],
  },

  // Visualisation
  {
    id: 'visualisation_beach',
    name: 'Plage au Coucher du Soleil',
    type: 'visualisation',
    description: 'Visualisation guidée d\'une plage apaisante',
    duration: 480,
    difficulty: 'facile',
    benefits: ['Profondément relaxant', 'Prépare aux rêves', 'Évacue le stress'],
    steps: [
      'Imaginez une plage déserte',
      'Sentez le sable sous vos pieds',
      'Écoutez les vagues',
      'Respirez l\'air marin',
      'Regardez le soleil se coucher',
    ],
  },
  {
    id: 'visualisation_forest',
    name: 'Forêt Enchantée',
    type: 'visualisation',
    description: 'Promenade imaginaire dans une forêt magique',
    duration: 540,
    difficulty: 'moyen',
    benefits: ['Stimule l\'imagination', 'Favorise les rêves lucides', 'Apaisement'],
    steps: [
      'Marchez dans une forêt luxuriante',
      'Observez la lumière filtrée',
      'Écoutez les oiseaux',
      'Découvrez un endroit magique',
      'Installez-vous pour rêver',
    ],
  },

  // Relaxation
  {
    id: 'relaxation_progressive',
    name: 'Relaxation Musculaire Progressive',
    type: 'relaxation',
    description: 'Tension et relâchement de chaque groupe musculaire',
    duration: 600,
    difficulty: 'facile',
    benefits: ['Détente profonde', 'Relâche les tensions', 'Excellent pour dormir'],
    steps: [
      'Tendez vos pieds 5 secondes',
      'Relâchez complètement',
      'Remontez vers chaque groupe musculaire',
      'Terminez par le visage',
      'Restez détendu',
    ],
  },
  {
    id: 'relaxation_autogenic',
    name: 'Training Autogène',
    type: 'relaxation',
    description: 'Auto-suggestion pour relaxation profonde',
    duration: 480,
    difficulty: 'moyen',
    benefits: ['Relaxation intense', 'Améliore le sommeil', 'Réduit le stress'],
    steps: [
      'Répétez mentalement "Je suis calme"',
      'Sentez la lourdeur dans vos membres',
      'Ressentez la chaleur',
      'Le cœur bat calmement',
      'La respiration est fluide',
    ],
  },
];

export interface ExerciseSession {
  exerciseId: string;
  date: string;
  completed: boolean;
  duration: number;
}

export interface ExerciseStreak {
  currentStreak: number;
  longestStreak: number;
  lastExerciseDate: string | null;
  totalSessions: number;
}

export interface RitualsData {
  lastAffirmationDate?: string;
  dailyAffirmation?: string;
  exerciseStreak: ExerciseStreak;
  completedExercises: ExerciseSession[];
  favoriteExercise?: string;
}

