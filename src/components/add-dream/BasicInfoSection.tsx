// Section informations de base
import * as Haptics from 'expo-haptics';
import React from 'react';
import { View } from 'react-native';
import { Input, Picker } from '..';
import { DreamType } from '../../types';
import { DatePickerField } from './DatePickerField';
import { SectionHeader } from './SectionHeader';

interface BasicInfoSectionProps {
  title: string;
  description: string;
  date: string;
  type: DreamType;
  showDatePicker: boolean;
  dreamTypeOptions: Array<{ label: string; value: string; icon: string }>;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: string) => void;
  onTypeChange: (type: DreamType) => void;
  onToggleDatePicker: (show: boolean) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  description,
  date,
  type,
  showDatePicker,
  dreamTypeOptions,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onTypeChange,
  onToggleDatePicker,
}) => {
  return (
    <View className="bg-white dark:bg-dream-dusk mx-4 mt-5 rounded-3xl p-5 shadow-sm">
      <SectionHeader 
        icon="✍️" 
        title="Racontez votre rêve" 
        subtitle="Les détails essentiels"
      />

      <Input
        label="Titre (optionnel)"
        value={title}
        onChangeText={onTitleChange}
        placeholder="Un titre pour vous en souvenir..."
      />

      <Input
        label="Description *"
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Racontez votre rêve en détail... Qu'avez-vous vu, ressenti, vécu ?"
        multiline
        rows={6}
      />

      <DatePickerField
        value={date}
        onChange={onDateChange}
        showPicker={showDatePicker}
        onTogglePicker={onToggleDatePicker}
      />

      <Picker
        label="Type de rêve"
        value={type}
        options={dreamTypeOptions}
        onValueChange={(value) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTypeChange(value as DreamType);
        }}
      />
    </View>
  );
};

