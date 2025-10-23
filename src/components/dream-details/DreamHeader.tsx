// En-tête du rêve avec titre et date
import React from 'react';
import { Text, View } from 'react-native';
import { formatDreamDate, formatDreamTime, getDreamTypeIcon } from '../../utils';

interface DreamHeaderProps {
  type: string;
  title?: string;
  date: string;
  time: string;
  tone: string;
  moonPhaseEmoji?: string;
}

const getToneColor = (tone: string) => {
  switch (tone) {
    case 'positive': return 'text-green-600 dark:text-green-400';
    case 'négative': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

export const DreamHeader: React.FC<DreamHeaderProps> = ({
  type,
  title,
  date,
  time,
  tone,
  moonPhaseEmoji,
}) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
      <View className="flex-row items-center mb-4">
        <Text className="text-5xl mr-3">{getDreamTypeIcon(type as any)}</Text>
        <View className="flex-1">
          {title && (
            <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-1">
              {title}
            </Text>
          )}
          <Text className="text-gray-500 dark:text-gray-400">
            {formatDreamDate(date)} • {formatDreamTime(time)}
          </Text>
        </View>
        {moonPhaseEmoji && (
          <Text className="text-4xl">{moonPhaseEmoji}</Text>
        )}
      </View>

      <View className="flex-row space-x-2 mb-4">
        <View className="bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-2">
          <Text className="text-primary-700 dark:text-primary-300 font-semibold capitalize">
            {type}
          </Text>
        </View>
        <View className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <Text className={`${getToneColor(tone)} font-semibold capitalize`}>
            {tone}
          </Text>
        </View>
      </View>
    </View>
  );
};

