// Carte des statistiques du mois
import React from 'react';
import { Text, View } from 'react-native';

interface MonthStatsCardProps {
  total: number;
  daysWithDreams: number;
  avgPerDay: string;
}

export const MonthStatsCard: React.FC<MonthStatsCardProps> = ({
  total,
  daysWithDreams,
  avgPerDay,
}) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-2xl p-5 shadow-lg mb-4">
      <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
        📊 Ce mois-ci
      </Text>
      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="text-3xl font-bold text-primary-600 mb-1">{total}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
            Rêves
          </Text>
        </View>
        <View className="flex-1 items-center border-x border-gray-200 dark:border-gray-700">
          <Text className="text-3xl font-bold text-primary-600 mb-1">{daysWithDreams}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
            Jours actifs
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-3xl font-bold text-primary-600 mb-1">{avgPerDay}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
            Moy./jour
          </Text>
        </View>
      </View>
    </View>
  );
};

