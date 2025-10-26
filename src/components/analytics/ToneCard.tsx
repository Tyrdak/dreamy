// Carte de tonalité émotionnelle améliorée
import React from 'react';
import { Text, View } from 'react-native';

interface ToneCardProps {
  icon: string;
  label: string;
  count: number;
  percentage: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const ToneCard: React.FC<ToneCardProps> = ({
  icon,
  label,
  count,
  percentage,
  bgColor,
  borderColor,
  textColor,
}) => {
  return (
    <View className={`flex-1 ${bgColor} border ${borderColor} rounded-3xl p-5 shadow-lg backdrop-blur-sm`}>
      <View className="bg-white/30 dark:bg-black/20 rounded-2xl p-3 mb-4 items-center">
        <Text className="text-4xl">{icon}</Text>
      </View>
      <Text className={`${textColor} font-bold text-3xl text-center mb-2`}>
        {count}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm text-center mb-3 font-medium">
        {label}
      </Text>
      <View className="bg-white/60 dark:bg-black/30 rounded-full px-3 py-2">
        <Text className={`${textColor} text-sm font-bold text-center`}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

