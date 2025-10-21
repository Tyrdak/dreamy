// Service d'export des rêves

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Dream } from '../types';

/**
 * Exporte les rêves en JSON et partage le fichier
 */
export const exportDreamsAsJSON = async (dreams: Dream[], username: string): Promise<boolean> => {
  try {
    const exportData = {
      app: 'Dreamy - Journal de Rêves',
      user: username,
      exportDate: new Date().toISOString(),
      totalDreams: dreams.length,
      dreams: dreams.map(dream => ({
        ...dream,
        // Formatage pour lisibilité
        dateFormatted: new Date(dream.date).toLocaleDateString('fr-FR'),
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `dreamy_export_${new Date().toISOString().split('T')[0]}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    // Vérifie si le partage est disponible
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exporter mes rêves',
      });
      return true;
    } else {
      console.log('Le partage n\'est pas disponible sur cet appareil');
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de l\'export JSON:', error);
    return false;
  }
};

/**
 * Exporte les rêves en format texte lisible
 */
export const exportDreamsAsText = async (dreams: Dream[], username: string): Promise<boolean> => {
  try {
    let textContent = `═══════════════════════════════════════
  JOURNAL DE RÊVES - ${username}
═══════════════════════════════════════

Exporté le : ${new Date().toLocaleDateString('fr-FR')}
Nombre de rêves : ${dreams.length}

═══════════════════════════════════════

`;

    dreams.forEach((dream, index) => {
      textContent += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÊVE #${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${dream.title ? `Titre: ${dream.title}\n` : ''}Date: ${new Date(dream.date).toLocaleDateString('fr-FR')}
Type: ${dream.type}
Phase lunaire: ${dream.moonPhase || 'Inconnue'} ${dream.moonPhaseEmoji || ''}

Description:
${dream.description}

Détails:
- Lieu: ${dream.location || 'Non spécifié'}
- Personnages: ${dream.characters.join(', ') || 'Aucun'}
- Tags: ${dream.tags.join(', ') || 'Aucun'}
- Intensité émotionnelle: ${dream.emotionalIntensity}/10
- Clarté: ${dream.clarity}/10
- Tonalité: ${dream.tone}
- Qualité du sommeil: ${dream.sleepQuality}

${dream.personalMeaning ? `Signification personnelle:\n${dream.personalMeaning}\n` : ''}
`;
    });

    const fileName = `dreamy_journal_${new Date().toISOString().split('T')[0]}.txt`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, textContent);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Exporter mon journal',
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de l\'export texte:', error);
    return false;
  }
};

/**
 * Exporte les statistiques en format texte
 */
export const exportStatsAsText = async (
  stats: any,
  username: string
): Promise<boolean> => {
  try {
    const textContent = `
═══════════════════════════════════════
  STATISTIQUES DE RÊVES - ${username}
═══════════════════════════════════════

Exporté le : ${new Date().toLocaleDateString('fr-FR')}

📊 Vue d'ensemble:
- Total de rêves: ${stats.totalDreams}
- Clarté moyenne: ${stats.averageClarity.toFixed(1)}/10
- Intensité moyenne: ${stats.averageIntensity.toFixed(1)}/10

🎭 Répartition par type:
${Object.entries(stats.dreamsByType)
  .filter(([, count]) => (count as number) > 0)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

🌈 Répartition par tonalité:
${Object.entries(stats.dreamsByTone)
  .filter(([, count]) => (count as number) > 0)
  .map(([tone, count]) => `- ${tone}: ${count}`)
  .join('\n')}

🌙 Rêves par phase lunaire:
${Object.entries(stats.dreamsByMoonPhase)
  .map(([phase, count]) => `- ${phase}: ${count}`)
  .join('\n')}

💖 Émotions les plus fréquentes:
${stats.mostCommonEmotions.join(', ')}

🏷️ Tags populaires:
${stats.mostCommonTags.join(', ')}

═══════════════════════════════════════
`;

    const fileName = `dreamy_stats_${new Date().toISOString().split('T')[0]}.txt`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, textContent);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Exporter mes statistiques',
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de l\'export des statistiques:', error);
    return false;
  }
};

