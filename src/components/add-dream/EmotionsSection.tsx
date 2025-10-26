// Section émotions
import * as Haptics from 'expo-haptics';
import React from 'react';
import { View } from 'react-native';
import { Picker, Slider } from '..';
import { EmotionalState } from '../../types';
import { SectionHeader } from './SectionHeader';

interface EmotionsSectionProps {
  emotionalStateBefore: EmotionalState;
  emotionalStateAfter: EmotionalState;
  emotionalIntensity: number;
  emotionalStateOptions: Array<{ label: string; value: string; icon: string }>;
  onEmotionalStateBeforeChange: (state: EmotionalState) => void;
  onEmotionalStateAfterChange: (state: EmotionalState) => void;
  onEmotionalIntensityChange: (intensity: number) => void;
}

export const EmotionsSection: React.FC<EmotionsSectionProps> = ({
  emotionalStateBefore,
  emotionalStateAfter,
  emotionalIntensity,
  emotionalStateOptions,
  onEmotionalStateBeforeChange,
  onEmotionalStateAfterChange,
  onEmotionalIntensityChange,
}) => {
  return (
    <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
      <SectionHeader 
        icon="💭" 
        title="Vos émotions" 
        subtitle="Avant, pendant et après"
      />

      <Picker
        label="Avant le sommeil"
        value={emotionalStateBefore}
        options={emotionalStateOptions}
        onValueChange={(state) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onEmotionalStateBeforeChange(state as EmotionalState);
        }}
      />

      <Picker
        label="Au réveil"
        value={emotionalStateAfter}
        options={emotionalStateOptions}
        onValueChange={(state) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onEmotionalStateAfterChange(state as EmotionalState);
        }}
      />

      <Slider
        label="Intensité émotionnelle"
        value={emotionalIntensity}
        onValueChange={onEmotionalIntensityChange}
        minimumValue={1}
        maximumValue={10}
        step={1}
        leftLabel="Faible"
        rightLabel="Intense"
      />
    </View>
  );
};

