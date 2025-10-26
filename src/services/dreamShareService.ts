import { Share } from 'react-native';
import { Dream } from '../types';

const generateDreamDescription = (dream: Dream): string => {
  const dreamDate = new Date(dream.date).toLocaleDateString('fr-FR');
  const dreamTime = new Date(dream.time).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  let description = `Mon rêve se nomme "${dream.title || 'Sans titre'}" et s'est déroulé le ${dreamDate} à ${dreamTime}. `;
  
  description += `C'était un rêve ${dream.type}. `;
  description += `Voici ce dont je me souviens : ${dream.description} `;
  
  if (dream.location) {
    description += `Le rêve se passait ${dream.location}. `;
  }
  
  if (dream.characters && dream.characters.length > 0) {
    description += `Les personnages présents étaient : ${dream.characters.join(', ')}. `;
  }
  
  description += `Avant le rêve, je me sentais ${dream.emotionalStateBefore}, et après je me sentais ${dream.emotionalStateAfter}. `;
  description += `L'intensité émotionnelle était de ${dream.emotionalIntensity}/10. `;
  description += `La clarté du rêve était de ${dream.clarity}/10 et la qualité de mon sommeil était ${dream.sleepQuality}. `;
  
  if (dream.moonPhase) {
    description += `C'était une ${dream.moonPhase} ${dream.moonPhaseEmoji || ''}. `;
  }
  
  if (dream.tags && dream.tags.length > 0) {
    description += `Mots-clés : ${dream.tags.join(', ')}. `;
  }
  
  if (dream.personalMeaning) {
    description += `Pour moi, ce rêve signifie : ${dream.personalMeaning} `;
  }
  
  return description.trim();
};

const generateShareContent = (dream: Dream): string => {
  const dreamDescription = generateDreamDescription(dream);
  const appLink = 'https://dreamy-app.com';
  
  return `${dreamDescription}

---
Partagé depuis Dreamy - Journal de Rêves
Téléchargez l'app : ${appLink}

#Dreamy #JournalDeRêves #Rêves`;
};

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

export const shareDreamAsFile = async (dream: Dream): Promise<boolean> => {
  return shareDreamAsText(dream);
};

export const getDreamDescription = (dream: Dream): string => {
  return generateDreamDescription(dream);
};

export const getDreamShareContent = (dream: Dream): string => {
  return generateShareContent(dream);
};
