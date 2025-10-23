// Carte de phase lunaire
import React from 'react';
import { Text, View } from 'react-native';

interface MoonPhaseCardProps {
  emoji: string;
  phaseName: string;
  illumination: number;
}

export const MoonPhaseCard: React.FC<MoonPhaseCardProps> = ({ emoji, phaseName, illumination }) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-lg border border-primary-100 dark:border-primary-900">
      <View className="flex-row items-center">
        <Text className="text-6xl mr-4">{emoji}</Text>
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            Phase lunaire actuelle
          </Text>
          <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-1">
            {phaseName}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs">
            {illumination}% illuminée
          </Text>
        </View>
      </View>
    </View>
  );
};

