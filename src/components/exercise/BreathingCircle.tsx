// Cercle de respiration animé
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface BreathingCircleProps {
  phase: string;
  countdown: number;
  scale: any;
  opacity: any;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({ phase, countdown, scale, opacity }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'pause': return 'Prêt ?';
      default: return '';
    }
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case 'inhale': return '🌬️';
      case 'hold': return '⏸️';
      case 'exhale': return '💨';
      case 'pause': return '🧘';
      default: return '';
    }
  };

  return (
    <View className="items-center justify-center my-12">
      <Animated.View
        style={[animatedStyle]}
        className="w-64 h-64 rounded-full bg-primary-500 items-center justify-center"
      >
        <Text className="text-6xl mb-4">{getPhaseEmoji()}</Text>
        <Text className="text-white text-2xl font-bold mb-2">{getPhaseText()}</Text>
        <Text className="text-white text-6xl font-bold">{countdown}</Text>
      </Animated.View>
    </View>
  );
};

