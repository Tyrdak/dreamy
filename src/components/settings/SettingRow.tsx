// Ligne de paramètre avec switch
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Switch, Text, View } from 'react-native';

interface SettingRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({ title, subtitle, value, onValueChange, icon }) => (
  <View className="flex-row justify-between items-center py-3">
    <View className="flex-1 mr-4">
      {icon && <Text className="text-xl mb-1">{icon}</Text>}
      <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-1">
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: '#a78bfa' }} className="text-sm">
          {subtitle}
        </Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={(val) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(val);
      }}
      trackColor={{ false: '#d1d5db', true: '#fef08a' }}
      thumbColor={value ? '#312e81' : '#f3f4f6'}
    />
  </View>
);

