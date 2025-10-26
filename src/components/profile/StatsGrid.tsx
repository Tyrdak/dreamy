// Grille de statistiques
import React from 'react';
import { Text, View } from 'react-native';

interface StatsGridProps {
  totalDreams: number;
  currentStreak: number;
  longestStreak: number;
  badgesCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalDreams,
  currentStreak,
  longestStreak,
  badgesCount,
}) => {
  const StatCard = ({ icon, value, label }: { icon: string; value: number; label: string }) => (
    <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 items-center mx-1">
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className="text-2xl font-bold text-primary-600 mb-1">{value}</Text>
      <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">{label}</Text>
    </View>
  );

  return (
    <View className="px-6 mt-6">
      <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
        Mes statistiques
      </Text>
      <View className="flex-row mb-3">
        <StatCard icon="📚" value={totalDreams} label="Rêves" />
        <StatCard icon="🔥" value={currentStreak} label="Série actuelle" />
      </View>
      <View className="flex-row">
        <StatCard icon="⚡" value={longestStreak} label="Record" />
        <StatCard icon="🏆" value={badgesCount} label="Badges" />
      </View>
    </View>
  );
};

