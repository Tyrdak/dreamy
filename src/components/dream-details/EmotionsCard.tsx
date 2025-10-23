// Carte des émotions
import React from 'react';
import { Text, View } from 'react-native';
import { InfoCard } from './InfoCard';

interface EmotionsCardProps {
  emotionalStateBefore: string;
  emotionalStateAfter: string;
  emotionalIntensity: number;
}

const emotionEmojis: Record<string, string> = {
  joyeux: '😊',
  calme: '😌',
  anxieux: '😰',
  triste: '😢',
  excité: '🤩',
  confus: '😕',
  neutre: '😐',
};

export const EmotionsCard: React.FC<EmotionsCardProps> = ({
  emotionalStateBefore,
  emotionalStateAfter,
  emotionalIntensity,
}) => {
  return (
    <InfoCard icon="heart" iconColor="#ec4899" title="Émotions">
      <View className="flex-row justify-between mb-4">
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Avant le sommeil</Text>
          <View className="flex-row items-center">
            <Text className="text-3xl mr-2">{emotionEmojis[emotionalStateBefore]}</Text>
            <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
              {emotionalStateBefore}
            </Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Au réveil</Text>
          <View className="flex-row items-center">
            <Text className="text-3xl mr-2">{emotionEmojis[emotionalStateAfter]}</Text>
            <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
              {emotionalStateAfter}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          Intensité émotionnelle
        </Text>
        <View className="flex-row items-center">
          <View className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mr-3">
            <View
              className="bg-pink-500 h-3 rounded-full"
              style={{ width: `${(emotionalIntensity / 10) * 100}%` }}
            />
          </View>
          <Text className="text-pink-600 dark:text-pink-400 font-bold">
            {emotionalIntensity}/10
          </Text>
        </View>
      </View>
    </InfoCard>
  );
};

