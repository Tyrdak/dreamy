// En-tête de la date sélectionnée
import React from 'react';
import { Text, View } from 'react-native';

interface DateHeaderProps {
  dateMessage: string;
  formattedDate: string;
  moonPhaseEmoji: string;
  moonPhaseName: string;
  dreamsCount: number;
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  dateMessage,
  formattedDate,
  moonPhaseEmoji,
  moonPhaseName,
  dreamsCount,
}) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-2xl p-5 shadow-lg mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-primary-600 text-sm font-semibold mb-1">
            {dateMessage}
          </Text>
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
            {formattedDate}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-5xl mb-1">{moonPhaseEmoji}</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center">
            {moonPhaseName}
          </Text>
        </View>
      </View>
      
      {dreamsCount > 0 && (
        <View className="bg-primary-100 dark:bg-primary-900 rounded-xl p-3 mt-2">
          <Text className="text-primary-700 dark:text-primary-300 text-center font-semibold">
            {dreamsCount} rêve{dreamsCount > 1 ? 's' : ''} ce jour-là
          </Text>
        </View>
      )}
    </View>
  );
};

