// Carte d'insight personnalisé améliorée
import React from 'react';
import { Text, View } from 'react-native';

interface InsightCardProps {
  emoji: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  emoji,
  title,
  description,
  gradientFrom,
  gradientTo,
  borderColor,
  textColor,
}) => {
  return (
    <View className={`${gradientFrom} ${gradientTo} border ${borderColor} rounded-3xl p-6 shadow-lg backdrop-blur-sm`}>
      <View className="flex-row items-start">
        <View className="bg-white/20 dark:bg-black/20 rounded-2xl p-3 mr-4">
          <Text className="text-3xl">{emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className={`${textColor} font-bold text-lg mb-2`}>
            {title}
          </Text>
          <Text className={`${textColor.replace('900', '700').replace('100', '300')} text-sm leading-6`}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

