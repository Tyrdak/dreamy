// Service pour récupérer les affirmations depuis affirmations.dev

export interface Affirmation {
  affirmation: string;
}

/**
 * Récupère une affirmation depuis l'API affirmations.dev
 */
export const fetchAffirmation = async (): Promise<string> => {
  try {
    const response = await fetch('https://www.affirmations.dev/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data: Affirmation = await response.json();
      return data.affirmation;
    }
    
    // Fallback si l'API ne répond pas
    return getFallbackAffirmation();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'affirmation:', error);
    return getFallbackAffirmation();
  }
};

/**
 * Affirmations de secours si l'API est indisponible
 */
const FALLBACK_AFFIRMATIONS = [
  "You are capable of amazing things",
  "You know more than you think",
  "You are stronger than you believe",
  "Your potential is limitless",
  "You are worthy of all good things",
  "You are making progress every day",
  "You have the power to create change",
  "You are enough just as you are",
  "You are deserving of happiness",
  "Your dreams are valid and achievable",
];

const getFallbackAffirmation = (): string => {
  const index = Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length);
  return FALLBACK_AFFIRMATIONS[index];
};

