// En-tête de l'exercice
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ExerciseHeaderProps {
  title: string;
  onBack: () => void;
  topInset: number;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ title, onBack, topInset }) => {
  return (
    <View style={{ paddingTop: topInset + 12, backgroundColor: '#312e81' }} className="pb-4 px-6">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fef08a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center mr-6" style={{ color: '#fef08a' }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

