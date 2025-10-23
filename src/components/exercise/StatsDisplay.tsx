// Affichage des statistiques
import React from 'react';
import { Text, View } from 'react-native';

interface StatsDisplayProps {
  cycleCount: number;
  elapsedTime: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ cycleCount, elapsedTime }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-row justify-around px-6 mb-8">
      <View className="items-center">
        <Text className="text-3xl font-bold text-primary-600">{cycleCount}</Text>
        <Text className="text-gray-600 dark:text-gray-400 text-sm">Cycles</Text>
      </View>
      <View className="items-center">
        <Text className="text-3xl font-bold text-primary-600">{formatTime(elapsedTime)}</Text>
        <Text className="text-gray-600 dark:text-gray-400 text-sm">Temps écoulé</Text>
      </View>
    </View>
  );
};

