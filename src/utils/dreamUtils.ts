// Utilitaires pour les rêves

import { endOfDay, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dream, DreamFilters, DreamStatistics, DreamType, EmotionalState, Tone } from '../types';

/**
 * Génère un ID unique pour un rêve
 */
export const generateDreamId = (): string => {
  return `dream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formate la date d'un rêve pour l'affichage
 */
export const formatDreamDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

/**
 * Formate l'heure d'un rêve pour l'affichage
 */
export const formatDreamTime = (timeString: string): string => {
  try {
    const date = parseISO(timeString);
    return format(date, 'HH:mm');
  } catch (error) {
    return timeString;
  }
};

/**
 * Filtre les rêves selon les critères
 */
export const filterDreams = (dreams: Dream[], filters: DreamFilters): Dream[] => {
  return dreams.filter(dream => {
    // Filtre par type
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(dream.type)) return false;
    }
    
    // Filtre par émotion avant
    if (filters.emotionalStateBefore && filters.emotionalStateBefore.length > 0) {
      if (!filters.emotionalStateBefore.includes(dream.emotionalStateBefore)) return false;
    }
    
    // Filtre par émotion après
    if (filters.emotionalStateAfter && filters.emotionalStateAfter.length > 0) {
      if (!filters.emotionalStateAfter.includes(dream.emotionalStateAfter)) return false;
    }
    
    // Filtre par tonalité
    if (filters.tone && filters.tone.length > 0) {
      if (!filters.tone.includes(dream.tone)) return false;
    }
    
    // Filtre par tags
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => 
        dream.tags.some(dreamTag => dreamTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasTag) return false;
    }
    
    // Filtre par personnages
    if (filters.characters && filters.characters.length > 0) {
      const hasCharacter = filters.characters.some(character =>
        dream.characters.some(dreamChar => 
          dreamChar.toLowerCase().includes(character.toLowerCase())
        )
      );
      if (!hasCharacter) return false;
    }
    
    // Filtre par phase lunaire
    if (filters.moonPhase && filters.moonPhase.length > 0 && dream.moonPhase) {
      if (!filters.moonPhase.includes(dream.moonPhase)) return false;
    }
    
    // Filtre par date (début)
    if (filters.dateFrom) {
      const dreamDate = parseISO(dream.date);
      const fromDate = startOfDay(parseISO(filters.dateFrom));
      if (isBefore(dreamDate, fromDate)) return false;
    }
    
    // Filtre par date (fin)
    if (filters.dateTo) {
      const dreamDate = parseISO(dream.date);
      const toDate = endOfDay(parseISO(filters.dateTo));
      if (isAfter(dreamDate, toDate)) return false;
    }
    
    // Recherche textuelle
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `
        ${dream.title || ''}
        ${dream.description}
        ${dream.location}
        ${dream.personalMeaning}
        ${dream.tags.join(' ')}
        ${dream.characters.join(' ')}
      `.toLowerCase();
      
      if (!searchableText.includes(query)) return false;
    }
    
    return true;
  });
};

/**
 * Trie les rêves par date (plus récent en premier)
 */
export const sortDreamsByDate = (dreams: Dream[], ascending: boolean = false): Dream[] => {
  return [...dreams].sort((a, b) => {
    const dateA = parseISO(a.date).getTime();
    const dateB = parseISO(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Calcule les statistiques des rêves
 */
export const calculateDreamStatistics = (dreams: Dream[]): DreamStatistics => {
  const dreamsByType: Record<DreamType, number> = {
    'cauchemar': 0,
    'lucide': 0,
    'ordinaire': 0,
    'récurrent': 0,
    'prémonitoire': 0,
  };
  
  const dreamsByTone: Record<Tone, number> = {
    'positive': 0,
    'neutre': 0,
    'négative': 0,
  };
  
  const dreamsByMoonPhase: Record<string, number> = {};
  const emotionsMap: Record<EmotionalState, number> = {
    'joyeux': 0,
    'calme': 0,
    'anxieux': 0,
    'triste': 0,
    'excité': 0,
    'confus': 0,
    'neutre': 0,
  };
  const tagsMap: Record<string, number> = {};
  const charactersMap: Record<string, number> = {};
  
  let totalClarity = 0;
  let totalIntensity = 0;
  
  dreams.forEach(dream => {
    // Types
    dreamsByType[dream.type]++;
    
    // Tonalités
    dreamsByTone[dream.tone]++;
    
    // Phases lunaires
    if (dream.moonPhase) {
      dreamsByMoonPhase[dream.moonPhase] = (dreamsByMoonPhase[dream.moonPhase] || 0) + 1;
    }
    
    // Émotions
    emotionsMap[dream.emotionalStateBefore]++;
    emotionsMap[dream.emotionalStateAfter]++;
    
    // Tags
    dream.tags.forEach(tag => {
      tagsMap[tag] = (tagsMap[tag] || 0) + 1;
    });
    
    // Personnages
    dream.characters.forEach(character => {
      charactersMap[character] = (charactersMap[character] || 0) + 1;
    });
    
    // Moyennes
    totalClarity += dream.clarity;
    totalIntensity += dream.emotionalIntensity;
  });
  
  // Trie et obtient les plus fréquents
  const mostCommonEmotions = Object.entries(emotionsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion as EmotionalState);
  
  const mostCommonTags = Object.entries(tagsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
  
  const mostCommonCharacters = Object.entries(charactersMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([character]) => character);
  
  return {
    totalDreams: dreams.length,
    dreamsByType,
    dreamsByTone,
    dreamsByMoonPhase,
    averageClarity: dreams.length > 0 ? totalClarity / dreams.length : 0,
    averageIntensity: dreams.length > 0 ? totalIntensity / dreams.length : 0,
    mostCommonEmotions,
    mostCommonTags,
    mostCommonCharacters,
  };
};

/**
 * Obtient un résumé court de la description
 */
export const getDreamSummary = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
};

/**
 * Obtient la couleur associée à un type de rêve
 */
export const getDreamTypeColor = (type: DreamType): string => {
  const colors: Record<DreamType, string> = {
    'cauchemar': '#dc2626',
    'lucide': '#7c3aed',
    'ordinaire': '#3b82f6',
    'récurrent': '#f59e0b',
    'prémonitoire': '#10b981',
  };
  return colors[type];
};

/**
 * Obtient l'icône associée à un type de rêve
 */
export const getDreamTypeIcon = (type: DreamType): string => {
  const icons: Record<DreamType, string> = {
    'cauchemar': '😱',
    'lucide': '✨',
    'ordinaire': '💭',
    'récurrent': '🔄',
    'prémonitoire': '🔮',
  };
  return icons[type];
};

/**
 * Analyse les mots-clés récurrents dans les descriptions de rêves
 */
export const analyzeKeywords = (dreams: Dream[]): { word: string; count: number }[] => {
  // Mots à ignorer (stop words en français)
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc',
    'or', 'ni', 'car', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
    'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'ce', 'cet', 'cette',
    'ces', 'qui', 'que', 'quoi', 'dont', 'où', 'dans', 'sur', 'sous', 'avec', 'sans',
    'pour', 'par', 'en', 'au', 'aux', 'à', 'été', 'être', 'avoir', 'eu', 'ai', 'as',
    'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont',
  ]);

  const wordCount: Record<string, number> = {};

  dreams.forEach((dream) => {
    // Combine description et signification
    const text = `${dream.description} ${dream.personalMeaning || ''}`.toLowerCase();
    
    // Nettoie et split
    const words = text
      .replace(/[^\w\sàâäéèêëïîôùûüÿæœç]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  // Convertit en array et trie
  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20
};

/**
 * Trouve les thèmes récurrents (groupes de mots-clés similaires)
 */
export const findRecurringThemes = (dreams: Dream[]): Record<string, number> => {
  const themes: Record<string, number> = {};

  // Thèmes prédéfinis basés sur les tags et descriptions
  const themeKeywords = {
    'Eau': ['eau', 'mer', 'océan', 'rivière', 'lac', 'pluie', 'nager'],
    'Vol': ['voler', 'vol', 'air', 'ciel', 'nuage', 'oiseau'],
    'Poursuite': ['poursuivi', 'courir', 'fuir', 'chasser', 'échapper'],
    'Famille': ['famille', 'mère', 'père', 'frère', 'sœur', 'parent'],
    'Maison': ['maison', 'chambre', 'appartement', 'domicile', 'chez'],
    'École/Travail': ['école', 'classe', 'travail', 'bureau', 'collègue', 'patron'],
    'Animaux': ['chien', 'chat', 'animal', 'oiseau', 'serpent', 'araignée'],
    'Mort': ['mort', 'mourir', 'décès', 'funérailles', 'tombe'],
  };

  dreams.forEach((dream) => {
    const text = `${dream.description} ${dream.personalMeaning || ''} ${dream.tags.join(' ')}`.toLowerCase();

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        themes[theme] = (themes[theme] || 0) + 1;
      }
    });
  });

  return themes;
};

