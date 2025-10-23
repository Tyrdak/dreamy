// Carte de statistique
import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  emoji: string;
  label: string;
  value: string | number;
  subtitle: string;
  badgeColor?: string;
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  emoji,
  label,
  value,
  subtitle,
  badgeColor = 'bg-primary-100 dark:bg-primary-900',
  badgeText = 'STAT',
}) => {
  return (
    <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-5 shadow-lg">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-4xl">{emoji}</Text>
        <View className={`${badgeColor} rounded-full px-3 py-1`}>
          <Text className="text-primary-700 dark:text-primary-300 text-xs font-bold">
            {badgeText}
          </Text>
        </View>
      </View>
      <Text className="text-3xl font-bold text-dream-night dark:text-dream-cloud mb-1">
        {value}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-sm">
        {subtitle}
      </Text>
    </View>
  );
};

