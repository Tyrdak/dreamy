// Bouton d'action pour les paramètres
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SettingButtonProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'default' | 'danger';
  iconColor?: string;
}

export const SettingButton: React.FC<SettingButtonProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default',
  iconColor,
}) => {
  const isDanger = variant === 'danger';
  const bgClass = isDanger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800';
  const textColor = isDanger ? 'text-red-600 dark:text-red-400' : 'text-dream-night dark:text-dream-cloud';
  const subtitleColor = isDanger ? 'text-red-500 dark:text-red-400' : '#a78bfa';
  const iconCol = iconColor || (isDanger ? '#ef4444' : '#fef08a');

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${bgClass}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: '#312e81' }}
        >
          <Ionicons name={icon} size={20} color={iconCol} />
        </View>
        <View className="flex-1">
          <Text className={`font-semibold ${textColor}`}>{title}</Text>
          {subtitle && (
            <Text className="text-sm" style={{ color: typeof subtitleColor === 'string' ? subtitleColor : '#a78bfa' }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
};

