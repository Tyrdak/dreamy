// Composant carte de rêve

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Dream } from '../../types';
import { formatDreamDate, getDreamSummary, getDreamTypeIcon } from '../../utils';

interface DreamCardProps {
  dream: Dream;
  onPress: () => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({ dream, onPress }) => {
  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
      case 'négative':
        return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
    }
  };

  const getToneTextColor = (tone: string) => {
    switch (tone) {
      case 'positive':
        return 'text-green-700 dark:text-green-300';
      case 'négative':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white dark:bg-dream-dusk rounded-2xl p-4 mb-4 shadow-lg border border-gray-100 dark:border-dream-purple"
    >
      {/* En-tête */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <Text className="text-3xl mr-2">{getDreamTypeIcon(dream.type)}</Text>
          <View className="flex-1">
            {dream.title && (
              <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-1" numberOfLines={1}>
                {dream.title}
              </Text>
            )}
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDreamDate(dream.date)}
            </Text>
          </View>
        </View>
        
        {dream.moonPhaseEmoji && (
          <Text className="text-2xl ml-2">{dream.moonPhaseEmoji}</Text>
        )}
      </View>

      {/* Description */}
      <Text className="text-dream-night dark:text-dream-cloud mb-3" numberOfLines={3}>
        {getDreamSummary(dream.description, 120)}
      </Text>

      {/* Tags */}
      {dream.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {dream.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              className="bg-primary-100 dark:bg-primary-900 rounded-full px-2 py-1 mr-2 mb-1"
            >
              <Text className="text-primary-700 dark:text-primary-300 text-xs">
                #{tag}
              </Text>
            </View>
          ))}
          {dream.tags.length > 3 && (
            <View className="bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                +{dream.tags.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <View className={`${getToneColor(dream.tone)} rounded-full px-3 py-1 border`}>
          <Text className={`${getToneTextColor(dream.tone)} text-xs font-semibold capitalize`}>
            {dream.tone}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-3">
            <Ionicons name="flash" size={14} color="#7c6df1" />
            <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
              {dream.emotionalIntensity}/10
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="eye" size={14} color="#7c6df1" />
            <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1">
              {dream.clarity}/10
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

