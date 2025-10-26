// En-tête de section du formulaire
import React from 'react';
import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <View className="mb-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: '#a78bfa30' }}>
      <View className="flex-row items-center mb-1">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#a78bfa20' }}>
          <Text className="text-xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
            {title}
          </Text>
          {subtitle && (
            <Text style={{ color: '#a78bfa' }} className="text-xs mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

