// Carte des détails du rêve
import React from 'react';
import { Text, View } from 'react-native';
import { InfoCard } from './InfoCard';

interface DetailsCardProps {
  location?: string;
  characters: string[];
  tags: string[];
  clarity: number;
  sleepQuality: string;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
  location,
  characters,
  tags,
  clarity,
  sleepQuality,
}) => {
  return (
    <InfoCard icon="information-circle" iconColor="#3b82f6" title="Détails">
      {location && (
        <View className="mb-4">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Lieu</Text>
          <Text className="text-dream-night dark:text-dream-cloud">{location}</Text>
        </View>
      )}

      {characters.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">Personnages</Text>
          <View className="flex-row flex-wrap">
            {characters.map((character, index) => (
              <View key={index} className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 m-1">
                <Text className="text-blue-700 dark:text-blue-300 text-sm">{character}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {tags.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">Tags</Text>
          <View className="flex-row flex-wrap">
            {tags.map((tag, index) => (
              <View key={index} className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 m-1">
                <Text className="text-gray-700 dark:text-gray-300 text-sm">#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Clarté</Text>
          <Text className="text-dream-night dark:text-dream-cloud font-bold">{clarity}/10</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-1">Sommeil</Text>
          <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
            {sleepQuality}
          </Text>
        </View>
      </View>
    </InfoCard>
  );
};

