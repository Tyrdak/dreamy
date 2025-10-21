// Service pour récupérer les citations inspirantes

import { DailyQuote } from '../types';

/**
 * Citations inspirantes locales (fallback)
 */
const LOCAL_QUOTES: DailyQuote[] = [
  {
    text: "Les rêves sont la littérature du sommeil.",
    author: "Jean Cocteau",
    date: new Date().toISOString(),
  },
  {
    text: "Un rêve sans étoiles est un rêve oublié.",
    author: "Proverbe",
    date: new Date().toISOString(),
  },
  {
    text: "Les rêves sont les illustrations du livre que votre âme écrit sur vous.",
    author: "Marsha Norman",
    date: new Date().toISOString(),
  },
  {
    text: "Un rêve est un désir que fait le cœur.",
    author: "Walt Disney",
    date: new Date().toISOString(),
  },
  {
    text: "La nuit porte conseil car elle nous permet de rêver.",
    author: "Proverbe",
    date: new Date().toISOString(),
  },
  {
    text: "Le futur appartient à ceux qui croient en la beauté de leurs rêves.",
    author: "Eleanor Roosevelt",
    date: new Date().toISOString(),
  },
  {
    text: "Les rêves sont des fenêtres sur l'âme.",
    author: "Anonyme",
    date: new Date().toISOString(),
  },
  {
    text: "Dans les rêves commence la responsabilité.",
    author: "W.B. Yeats",
    date: new Date().toISOString(),
  },
  {
    text: "Tous les hommes sont des rêveurs. La question est de savoir si vous êtes un rêveur éveillé.",
    author: "Proverbe",
    date: new Date().toISOString(),
  },
  {
    text: "Le sommeil est le meilleur des médicaments.",
    author: "Proverbe irlandais",
    date: new Date().toISOString(),
  },
];

/**
 * Récupère une citation aléatoire locale
 */
export const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * LOCAL_QUOTES.length);
  const quote = LOCAL_QUOTES[randomIndex];
  return {
    ...quote,
    date: new Date().toISOString(),
  };
};

/**
 * Récupère la citation du jour (essaie l'API, sinon utilise locale)
 */
export const fetchDailyQuote = async (): Promise<DailyQuote> => {
  try {
    // Essaie l'API ZenQuotes
    const response = await fetch('https://zenquotes.io/api/today');
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          text: data[0].q,
          author: data[0].a,
          date: new Date().toISOString(),
        };
      }
    }
    
    // Fallback sur citation locale
    return getRandomQuote();
  } catch (error) {
    console.error('Erreur lors de la récupération de la citation:', error);
    // Utilise citation locale
    return getRandomQuote();
  }
};

