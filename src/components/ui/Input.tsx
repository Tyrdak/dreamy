// Composant input réutilisable

import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  multiline = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-dream-night dark:text-dream-cloud text-sm font-semibold mb-2">
          {label}
        </Text>
      )}
      
      <View className={`
        flex-row items-center
        bg-white dark:bg-dream-dusk
        border-2 
        ${error ? 'border-red-500' : 'border-gray-200 dark:border-dream-purple'}
        rounded-xl
        px-4
        ${multiline ? 'py-3' : 'py-2'}
      `.trim()}>
        {icon && <View className="mr-2">{icon}</View>}
        
        <TextInput
          className={`
            flex-1
            text-dream-night dark:text-dream-cloud
            ${multiline ? 'min-h-[100px]' : 'h-12'}
            ${className}
          `.trim()}
          placeholderTextColor="#9ca3af"
          multiline={multiline}
          numberOfLines={multiline ? rows : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </View>
      
      {hint && !error && (
        <Text className="text-gray-500 text-xs mt-1">{hint}</Text>
      )}
      
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};

