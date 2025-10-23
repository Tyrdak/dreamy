// Bouton de filtre
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonProps {
  activeFiltersCount: number;
  onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ activeFiltersCount, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        ${activeFiltersCount > 0 ? 'bg-primary-600' : 'bg-gray-100 dark:bg-dream-night'}
        rounded-2xl w-14 h-14 items-center justify-center
      `.trim()}
    >
      <Ionicons
        name="options-outline"
        size={26}
        color={activeFiltersCount > 0 ? '#ffffff' : '#7c6df1'}
      />
      {activeFiltersCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-primary-600 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
          <Text className="text-white text-xs font-bold">{activeFiltersCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

