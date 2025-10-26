// Service de partage de rêves individuels

import { Share } from 'react-native';
import { Dream } from '../types';

/**
 * Génère une phrase formatée pour décrire le rêve
 */
const generateDreamDescription = (dream: Dream): string => {
  const dreamDate = new Date(dream.date).toLocaleDateString('fr-FR');
  const dreamTime = new Date(dream.time).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  let description = `Mon rêve se nomme "${dream.title || 'Sans titre'}" et s'est déroulé le ${dreamDate} à ${dreamTime}. `;
  
  // Type de rêve
  description += `C'était un rêve ${dream.type}. `;
  
  // Description principale
  description += `Voici ce dont je me souviens : ${dream.description} `;
  
  // Détails supplémentaires
  if (dream.location) {
    description += `Le rêve se passait ${dream.location}. `;
  }
  
  if (dream.characters && dream.characters.length > 0) {
    description += `Les personnages présents étaient : ${dream.characters.join(', ')}. `;
  }
  
  // États émotionnels
  description += `Avant le rêve, je me sentais ${dream.emotionalStateBefore}, et après je me sentais ${dream.emotionalStateAfter}. `;
  description += `L'intensité émotionnelle était de ${dream.emotionalIntensity}/10. `;
  
  // Clarté et qualité
  description += `La clarté du rêve était de ${dream.clarity}/10 et la qualité de mon sommeil était ${dream.sleepQuality}. `;
  
  // Phase lunaire
  if (dream.moonPhase) {
    description += `C'était une ${dream.moonPhase} ${dream.moonPhaseEmoji || ''}. `;
  }
  
  // Tags
  if (dream.tags && dream.tags.length > 0) {
    description += `Mots-clés : ${dream.tags.join(', ')}. `;
  }
  
  // Signification personnelle
  if (dream.personalMeaning) {
    description += `Pour moi, ce rêve signifie : ${dream.personalMeaning} `;
  }
  
  return description.trim();
};

/**
 * Génère le contenu complet du fichier de partage
 */
const generateShareContent = (dream: Dream): string => {
  const dreamDescription = generateDreamDescription(dream);
  const appLink = 'https://dreamy-app.com'; // Lien vers l'application
  
  return `${dreamDescription}

---
Partagé depuis Dreamy - Journal de Rêves
Téléchargez l'app : ${appLink}

#Dreamy #JournalDeRêves #Rêves`;
};

/**
 * Partage un rêve sous forme de texte
 */
export const shareDreamAsText = async (dream: Dream): Promise<boolean> => {
  try {
    const content = generateShareContent(dream);
    
    const result = await Share.share({
      title: `Rêve: ${dream.title || 'Sans titre'}`,
      message: content,
    });

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Erreur lors du partage:', error);
    return false;
  }
};

/**
 * Partage un rêve sous forme de fichier texte (alias pour compatibilité)
 */
export const shareDreamAsFile = async (dream: Dream): Promise<boolean> => {
  return shareDreamAsText(dream);
};

/**
 * Génère juste la description du rêve (pour affichage ou autres usages)
 */
export const getDreamDescription = (dream: Dream): string => {
  return generateDreamDescription(dream);
};

/**
 * Génère le contenu complet de partage (pour affichage ou autres usages)
 */
export const getDreamShareContent = (dream: Dream): string => {
  return generateShareContent(dream);
};
