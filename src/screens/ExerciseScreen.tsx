// Écran d'exercice avec timer interactif
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { BreathingCircle, ExerciseHeader, StatsDisplay } from '../components/exercise';
import { completeExerciseSession } from '../storage';
import { Exercise } from '../types';

interface ExerciseScreenProps {
  navigation: any;
  route: any;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { exercise } = route.params as { exercise: Exercise };

  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('pause');
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    let interval: any;
    if (isRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            nextPhase();
            return 0;
          }
          return prev - 1;
        });
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, countdown]);

  const nextPhase = () => {
    if (exercise.type === 'respiration') {
      if (currentPhase === 'inhale') {
        if (exercise.hold && exercise.hold > 0) {
          setCurrentPhase('hold');
          setCountdown(exercise.hold);
          animateCircle(1.2, 1);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          setCurrentPhase('exhale');
          setCountdown(exercise.exhale || 0);
          animateCircle(0.8, 1);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setCountdown(exercise.exhale || 0);
        animateCircle(0.8, 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (currentPhase === 'exhale') {
        setCurrentPhase('inhale');
        setCountdown(exercise.inhale || 0);
        setCycleCount((prev) => prev + 1);
        animateCircle(1.4, 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const animateCircle = (targetScale: number, targetOpacity: number) => {
    scale.value = withSpring(targetScale, { damping: 10, stiffness: 50 });
    opacity.value = withTiming(targetOpacity, { duration: 500 });
  };

  const startExercise = () => {
    setIsRunning(true);
    setCurrentPhase('inhale');
    setCountdown(exercise.inhale || 5);
    setCycleCount(0);
    setElapsedTime(0);
    animateCircle(1.4, 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const pauseExercise = () => {
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const resumeExercise = () => {
    setIsRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const finishExercise = async () => {
    setIsRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await completeExerciseSession(exercise.id, elapsedTime);

    Alert.alert(
      '🎉 Exercice terminé !',
      `Bravo ! Vous avez complété ${cycleCount} cycles en ${Math.floor(elapsedTime / 60)} minutes.`,
      [
        { text: 'Terminer', onPress: () => navigation.goBack() },
        { text: 'Recommencer', onPress: () => startExercise() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <ExerciseHeader title={exercise.name} onBack={() => navigation.goBack()} topInset={insets.top} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-6 mt-6">
          <Text className="text-gray-600 dark:text-gray-400 text-center">{exercise.description}</Text>
        </View>

        <BreathingCircle phase={currentPhase} countdown={countdown} scale={scale} opacity={opacity} />

        <StatsDisplay cycleCount={cycleCount} elapsedTime={elapsedTime} />

        <View className="px-6 gap-3">
          {!isRunning ? (
            <Button title={cycleCount > 0 ? 'Reprendre' : 'Commencer'} onPress={cycleCount > 0 ? resumeExercise : startExercise} />
          ) : (
            <>
              <Button title="Pause" onPress={pauseExercise} variant="secondary" />
              <Button title="Terminer" onPress={finishExercise} variant="outline" />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
