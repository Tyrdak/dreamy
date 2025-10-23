// Barre de recherche
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
  return (
    <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-dream-night rounded-2xl px-4 h-14">
      <Ionicons name="search" size={22} color="#9ca3af" />
      <TextInput
        className="flex-1 ml-3 text-dream-night dark:text-dream-cloud text-base"
        placeholder="Chercher dans mes rêves..."
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
      />
      {value && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={22} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};

