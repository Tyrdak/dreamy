// En-tête de section
import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  icon: string;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => (
  <View className="px-6 mt-6 mb-3">
    <View className="flex-row items-center">
      <Text className="text-2xl mr-2">{icon}</Text>
      <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
        {title}
      </Text>
    </View>
  </View>
);

