// Carte de statistique améliorée
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
    <View className="flex-1 bg-white/95 dark:bg-dream-dusk/95 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-white/30">
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-2">
          <Text className="text-3xl">{emoji}</Text>
        </View>
        <View className={`${badgeColor} rounded-full px-3 py-1 shadow-sm`}>
          <Text className="text-primary-700 dark:text-primary-300 text-xs font-bold">
            {badgeText}
          </Text>
        </View>
      </View>
      <Text className="text-3xl font-bold text-dream-night dark:text-dream-cloud mb-1">
        {value}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        {subtitle}
      </Text>
      <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
        {label}
      </Text>
    </View>
  );
};

