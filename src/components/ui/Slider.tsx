// Composant slider réutilisable

import RNSlider from '@react-native-community/slider';
import React from 'react';
import { Text, View } from 'react-native';

interface SliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  showValue?: boolean;
  unit?: string;
  leftLabel?: string;
  rightLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 10,
  step = 1,
  showValue = true,
  unit = '',
  leftLabel,
  rightLabel,
}) => {
  return (
    <View className="w-full mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-dream-night dark:text-dream-cloud text-sm font-semibold">
          {label}
        </Text>
        {showValue && (
          <Text className="text-primary-600 dark:text-primary-400 text-base font-bold">
            {value}{unit}
          </Text>
        )}
      </View>
      
      <RNSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#7c6df1"
        maximumTrackTintColor="#d1d5db"
        thumbTintColor="#7c6df1"
      />
      
      {(leftLabel || rightLabel) && (
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-500 text-xs">{leftLabel}</Text>
          <Text className="text-gray-500 text-xs">{rightLabel}</Text>
        </View>
      )}
    </View>
  );
};

