// Carte d'information générique
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface InfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, iconColor, title, children }) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={24} color={iconColor} />
        <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};

