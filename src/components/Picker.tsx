// Composant picker/sélecteur réutilisable

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface PickerOption {
  label: string;
  value: string;
  icon?: string;
}

interface PickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Picker: React.FC<PickerProps> = ({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Sélectionner...',
  error,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-dream-night dark:text-dream-cloud text-sm font-semibold mb-2">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className={`
          bg-white dark:bg-dream-dusk
          border-2
          ${error ? 'border-red-500' : 'border-gray-200 dark:border-dream-purple'}
          rounded-xl
          px-4
          py-3
          flex-row
          items-center
          justify-between
        `.trim()}
      >
        <View className="flex-row items-center flex-1">
          {selectedOption?.icon && (
            <Text className="text-2xl mr-2">{selectedOption.icon}</Text>
          )}
          <Text className={`${selectedOption ? 'text-dream-night dark:text-dream-cloud' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        
        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </TouchableOpacity>
      
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-dream-night rounded-t-3xl max-h-[70%]">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-dream-purple">
              <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
                {label}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="p-2">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsVisible(false);
                  }}
                  className={`
                    p-4
                    rounded-xl
                    mb-2
                    flex-row
                    items-center
                    ${value === option.value ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-50 dark:bg-dream-dusk'}
                  `.trim()}
                >
                  {option.icon && (
                    <Text className="text-2xl mr-3">{option.icon}</Text>
                  )}
                  <Text className={`
                    flex-1
                    ${value === option.value ? 'text-primary-700 dark:text-primary-300 font-semibold' : 'text-dream-night dark:text-dream-cloud'}
                  `.trim()}>
                    {option.label}
                  </Text>
                  
                  {value === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#7c6df1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

