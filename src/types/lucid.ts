// Types pour le mode Rêve Lucide

export interface LucidDreamSettings {
  enabled: boolean;
  realityCheckFrequency: number; // heures entre les checks
  lastRealityCheckTime?: string; // ISO date string
}

export interface RealityCheck {
  id: string;
  timestamp: string;
  question: string;
  completed: boolean;
}

// Questions pour les reality checks
export const REALITY_CHECK_QUESTIONS = [
  "Es-tu en train de rêver ? 🤔 Regarde tes mains.",
  "Ceci est-il réel ? 🌟 Essaie de voler.",
  "Vérification de réalité : lis ce texte deux fois.",
  "Dans un rêve, l'heure change constamment. Quelle heure est-il ?",
  "Les rêves n'ont pas de logique. Tout semble-t-il normal ?",
  "Regarde autour de toi. Y a-t-il des anomalies ?",
  "Essaie de respirer le nez bouché. Peux-tu quand même ?",
  "Regarde tes doigts. En as-tu 5 sur chaque main ?",
];

