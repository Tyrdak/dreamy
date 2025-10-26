// Test du système de partage de rêves
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { getDreamDescription, shareDreamAsFile } from '../services/dreamShareService';
import { Dream } from '../types';

// Rêve de test
const testDream: Dream = {
  id: 'test-dream-1',
  date: '2024-01-15T00:00:00.000Z',
  time: '2024-01-15T08:30:00.000Z',
  type: 'lucide',
  title: 'Mon premier rêve lucide',
  description: 'J\'ai rêvé que je volais au-dessus d\'une ville magnifique. Je pouvais contrôler ma direction et j\'ai exploré différents quartiers. C\'était incroyable de sentir le vent dans mes cheveux et de voir la ville d\'en haut.',
  emotionalStateBefore: 'calme',
  emotionalStateAfter: 'joyeux',
  emotionalIntensity: 8,
  characters: ['Moi', 'Un guide mystérieux'],
  location: 'Au-dessus d\'une ville moderne',
  clarity: 9,
  tags: ['vol', 'lucide', 'aventure', 'liberté'],
  sleepQuality: 'excellent',
  personalMeaning: 'Ce rêve représente ma quête de liberté et mon désir d\'explorer de nouveaux horizons dans ma vie.',
  tone: 'positive',
  moonPhase: 'Pleine Lune',
  moonPhaseEmoji: '🌕',
  createdAt: '2024-01-15T08:30:00.000Z',
  updatedAt: '2024-01-15T08:30:00.000Z',
};

export const DreamShareTest: React.FC = () => {
  const handleTestShare = async () => {
    try {
      const success = await shareDreamAsFile(testDream);
      if (success) {
        Alert.alert('Succès', 'Le rêve de test a été partagé !');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le rêve de test');
    }
  };

  const handleTestDescription = () => {
    const description = getDreamDescription(testDream);
    Alert.alert('Description du rêve', description);
  };

  return (
    <View className="p-4 bg-white dark:bg-dream-dusk rounded-lg m-4">
      <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
        Test du système de partage
      </Text>
      
      <TouchableOpacity
        onPress={handleTestShare}
        className="bg-green-500 p-3 rounded-lg mb-3"
      >
        <Text className="text-white text-center font-semibold">
          Tester le partage de fichier
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleTestDescription}
        className="bg-blue-500 p-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">
          Voir la description générée
        </Text>
      </TouchableOpacity>
    </View>
  );
};
