// Carte d'exercice
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Exercise, ExerciseType } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  isRecommended?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress, isRecommended }) => {
  const getTypeEmoji = (type: ExerciseType) => {
    const emojis = { respiration: '🌬️', meditation: '🧘', visualisation: '🌅', relaxation: '😌' };
    return emojis[type];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'text-green-600';
      case 'moyen': return 'text-yellow-600';
      case 'avancé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      className="bg-white dark:bg-dream-dusk rounded-2xl p-4 mb-3 shadow-md"
      activeOpacity={0.7}
    >
      {isRecommended && (
        <View className="bg-yellow-100 dark:bg-yellow-900 rounded-full px-3 py-1 self-start mb-2">
          <Text className="text-yellow-800 dark:text-yellow-200 text-xs font-semibold">
            ⭐ Recommandé maintenant
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl mr-2">{getTypeEmoji(exercise.type)}</Text>
            <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg flex-1">
              {exercise.name}
            </Text>
          </View>

          <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {exercise.description}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#9ca3af" />
              <Text className="text-gray-500 text-xs ml-1">{exercise.duration} min</Text>
            </View>
            <Text className={`text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#7c6df1" />
      </View>
    </TouchableOpacity>
  );
};

