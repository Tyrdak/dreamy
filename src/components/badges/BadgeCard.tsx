// Carte de badge
import React from 'react';
import { Text, View } from 'react-native';
import { Badge } from '../../types';

interface BadgeCardProps {
  badge: Badge;
  isLocked?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isLocked = false }) => {
  if (isLocked) {
    return (
      <View className="w-1/2 p-2">
        <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow opacity-60">
          <Text className="text-5xl text-center mb-2 opacity-40">{badge.emoji}</Text>
          <Text className="text-gray-700 dark:text-gray-300 font-bold text-center mb-1">
            {badge.name}
          </Text>
          <Text className="text-gray-500 dark:text-gray-500 text-xs text-center">
            {badge.description}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-1/2 p-2">
      <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg border-2 border-primary-300 dark:border-primary-700">
        <Text className="text-5xl text-center mb-2">{badge.emoji}</Text>
        <Text className="text-dream-night dark:text-dream-cloud font-bold text-center mb-1">
          {badge.name}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
          {badge.description}
        </Text>
        {badge.unlockedAt && (
          <Text className="text-primary-600 dark:text-primary-400 text-xs text-center mt-2">
            ✓ Débloqué
          </Text>
        )}
      </View>
    </View>
  );
};

