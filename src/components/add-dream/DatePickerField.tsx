// Champ de sélection de date
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface DatePickerFieldProps {
  value: string;
  onChange: (date: string) => void;
  showPicker: boolean;
  onTogglePicker: (show: boolean) => void;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  showPicker,
  onTogglePicker,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        📅 Date du rêve
      </Text>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTogglePicker(true);
        }}
        className="rounded-2xl px-4 py-3.5 flex-row items-center justify-between"
        style={{ 
          backgroundColor: '#fef08a15',
          borderWidth: 2,
          borderColor: '#fef08a'
        }}
      >
        <View className="flex-1">
          <Text className="text-base font-medium" style={{ color: '#312e81' }}>
            {new Date(value).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
          <Text className="text-xs mt-0.5 capitalize" style={{ color: '#a78bfa' }}>
            {new Date(value).toLocaleDateString('fr-FR', { weekday: 'long' })}
          </Text>
        </View>
        <Ionicons name="calendar" size={24} color="#fef08a" />
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={new Date(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            onTogglePicker(Platform.OS === 'ios');
            if (selectedDate) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(selectedDate.toISOString().split('T')[0]);
            }
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

