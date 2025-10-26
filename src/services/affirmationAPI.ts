import { Dream } from '../types';

export interface Affirmation {
  affirmation: string;
}

const API_URL = 'https://www.affirmations.dev';

export const fetchAffirmation = async (): Promise<string> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as Affirmation;
    return data.affirmation;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'affirmation:', error);
    throw error;
  }
};

export const fetchAffirmationsByCategory = async (category: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}?category=${category}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as Affirmation;
    return data.affirmation;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'affirmation pour la catégorie ${category}:`, error);
    throw error;
  }
};

export const getAffirmationForDream = async (dream: Dream): Promise<string> => {
  try {
    let category = 'general';
    
    switch (dream.tone) {
      case 'positive':
        category = 'motivation';
        break;
      case 'négative':
        category = 'comfort';
        break;
      case 'neutre':
        category = 'wisdom';
        break;
    }
    
    switch (dream.type) {
      case 'lucide':
        category = 'creativity';
        break;
      case 'cauchemar':
        category = 'comfort';
        break;
      case 'prémonitoire':
        category = 'intuition';
        break;
    }
    
    return await fetchAffirmationsByCategory(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'affirmation personnalisée:', error);
    return await fetchAffirmation();
  }
};