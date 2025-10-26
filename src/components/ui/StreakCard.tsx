// Composant d'affichage du streak

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { DreamStreak } from '../../types';

interface StreakCardProps {
  streak: DreamStreak;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  const getStreakEmoji = (days: number) => {
    if (days === 0) return '🌑';
    if (days < 3) return '🌒';
    if (days < 7) return '🌓';
    if (days < 14) return '🌔';
    if (days < 30) return '🌕';
    if (days < 100) return '✨';
    return '👑';
  };

  const getStreakMessage = (days: number) => {
    if (days === 0) return 'Commencez votre série !';
    if (days === 1) return 'Bon début !';
    if (days < 7) return 'Continuez comme ça !';
    if (days < 30) return 'Incroyable régularité !';
    if (days < 100) return 'Vous êtes une légende !';
    return 'Maître absolu des rêves !';
  };

  return (
    <View className="bg-primary-600 rounded-2xl p-5 mx-6 shadow-lg mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-5xl mr-4">{getStreakEmoji(streak.currentStreak)}</Text>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-white text-3xl font-bold mr-2">
                {streak.currentStreak}
              </Text>
              <Ionicons name="flame" size={24} color="#fef08a" />
            </View>
            <Text className="text-white/80 text-sm">
              {getStreakMessage(streak.currentStreak)}
            </Text>
          </View>
        </View>
        
        {streak.longestStreak > 0 && (
          <View className="items-end">
            <Text className="text-white/60 text-xs mb-1">Record</Text>
            <Text className="text-white font-bold text-lg">{streak.longestStreak} 🏆</Text>
          </View>
        )}
      </View>
    </View>
  );
};

