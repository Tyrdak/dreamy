// Statistiques rapides
import React from 'react';
import { Text, View } from 'react-native';

interface QuickStatsProps {
  totalDreams: number;
  averageClarity: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalDreams,
  averageClarity,
}) => {
  return (
    <View>
      <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
        Vos stats en bref
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow">
          <Text className="text-2xl font-bold text-primary-600 mb-1">
            {totalDreams}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs">Rêves</Text>
        </View>
        <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow">
          <Text className="text-2xl font-bold text-primary-600 mb-1">
            {averageClarity.toFixed(1)}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs">Clarté moy.</Text>
        </View>
      </View>
    </View>
  );
};

