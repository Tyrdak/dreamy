// Onglets de filtrage des exercices
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { ExerciseType } from '../../types';

interface FilterTabsProps {
  selected: ExerciseType | 'all';
  onSelect: (type: ExerciseType | 'all') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ selected, onSelect }) => {
  const tabs: Array<{ id: ExerciseType | 'all'; label: string; emoji: string }> = [
    { id: 'all', label: 'Tous', emoji: '✨' },
    { id: 'respiration', label: 'Respiration', emoji: '🌬️' },
    { id: 'meditation', label: 'Méditation', emoji: '🧘' },
    { id: 'visualisation', label: 'Visualisation', emoji: '🌅' },
    { id: 'relaxation', label: 'Relaxation', emoji: '😌' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mt-6">
      {tabs.map((tab) => {
        const isSelected = selected === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(tab.id);
            }}
            className={`mr-3 px-4 py-2 rounded-full ${
              isSelected ? 'bg-primary-600' : 'bg-white dark:bg-dream-dusk'
            }`}
          >
            <Text className={isSelected ? 'text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}>
              {tab.emoji} {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

