// Carte de progression des badges
import React from 'react';
import { Text, View } from 'react-native';

interface ProgressCardProps {
  totalUnlocked: number;
  totalBadges: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ totalUnlocked, totalBadges }) => {
  const percentage = (totalUnlocked / totalBadges) * 100;

  return (
    <View className="px-6 mt-6">
      <View className="bg-primary-600 rounded-2xl p-6 shadow-lg">
        <Text className="text-white text-center text-base mb-3">Badges débloqués</Text>
        <Text className="text-white text-6xl font-bold text-center mb-2">
          {totalUnlocked}/{totalBadges}
        </Text>
        <View className="h-2 bg-white/20 rounded-full overflow-hidden mt-2">
          <View className="h-full bg-dream-moon rounded-full" style={{ width: `${percentage}%` }} />
        </View>
      </View>
    </View>
  );
};

