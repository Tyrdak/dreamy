// Carte de tonalité émotionnelle
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
    <View className={`flex-1 ${bgColor} border ${borderColor} rounded-2xl p-4 shadow-sm`}>
      <Text className="text-4xl mb-3 text-center">{icon}</Text>
      <Text className={`${textColor} font-bold text-2xl text-center mb-1`}>
        {count}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-xs text-center mb-2">
        {label}
      </Text>
      <View className="bg-white/50 dark:bg-black/20 rounded-full px-2 py-1">
        <Text className={`${textColor} text-xs font-bold text-center`}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

