// Carte d'insight personnalisé
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
    <View className={`${gradientFrom} ${gradientTo} border ${borderColor} rounded-2xl p-5`}>
      <View className="flex-row items-start">
        <Text className="text-3xl mr-3">{emoji}</Text>
        <View className="flex-1">
          <Text className={`${textColor} font-bold text-base mb-1`}>
            {title}
          </Text>
          <Text className={`${textColor.replace('900', '800').replace('100', '200')} text-sm leading-5`}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

