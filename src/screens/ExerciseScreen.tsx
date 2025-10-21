// Écran d'exercice avec timer interactif

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components';
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
    let interval: NodeJS.Timeout;

    if (isRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Passe à la phase suivante
            nextPhase();
            return 0;
          }
          return prev - 1;
        });
        
        setElapsedTime(prev => prev + 1);
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
          // Vibration légère pour la retenue
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          setCurrentPhase('exhale');
          setCountdown(exercise.exhale || 0);
          animateCircle(0.8, 1);
          // Vibration moyenne pour l'expiration
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setCountdown(exercise.exhale || 0);
        animateCircle(0.8, 1);
        // Vibration moyenne pour l'expiration
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (currentPhase === 'exhale') {
        setCurrentPhase('inhale');
        setCountdown(exercise.inhale || 0);
        setCycleCount(prev => prev + 1);
        animateCircle(1.4, 1);
        // Vibration légère pour l'inspiration
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const animateCircle = (targetScale: number, targetOpacity: number) => {
    scale.value = withSpring(targetScale, {
      damping: 10,
      stiffness: 50,
    });
    opacity.value = withTiming(targetOpacity, { duration: 500 });
  };

  const startExercise = () => {
    setIsRunning(true);
    setCurrentPhase('inhale');
    setCountdown(exercise.inhale || 5);
    setCycleCount(0);
    setElapsedTime(0);
    animateCircle(1.4, 1);
    // Vibration de démarrage (succès)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const pauseExercise = () => {
    setIsRunning(false);
    // Vibration de pause (avertissement léger)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const resumeExercise = () => {
    setIsRunning(true);
    // Vibration de reprise
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const stopExercise = () => {
    // Vibration lors de l'arrêt
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      'Terminer l\'exercice ?',
      `Vous avez complété ${cycleCount} cycles en ${Math.floor(elapsedTime / 60)} min ${elapsedTime % 60}s.`,
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Terminer',
          onPress: async () => {
            await completeExerciseSession(exercise.id, elapsedTime);
            // Vibration de succès (terminé)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              '✨ Bravo !',
              'Session terminée ! Vous avez fait un pas de plus vers un meilleur sommeil.',
              [{ text: 'Super', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      default: return 'Prêt';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return '#10b981';
      case 'hold': return '#f59e0b';
      case 'exhale': return '#ef4444';
      default: return '#7c6df1';
    }
  };

  const getTypeEmoji = () => {
    switch (exercise.type) {
      case 'respiration': return '🌬️';
      case 'meditation': return '🧘';
      case 'visualisation': return '🌅';
      case 'relaxation': return '😌';
      default: return '✨';
    }
  };

  return (
    <View className="flex-1 bg-dream-night">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="pb-4 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
          
          {isRunning && (
            <View className="bg-white/10 rounded-full px-4 py-2">
              <Text className="text-white font-semibold">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}
          
          {isRunning && (
            <TouchableOpacity onPress={stopExercise}>
              <Ionicons name="stop" size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
          {!isRunning && <View style={{ width: 24 }} />}
        </View>
      </View>

      <View className="flex-1 justify-center items-center px-8">
        {/* Info exercice */}
        <Text className="text-white/70 text-sm mb-2">{getTypeEmoji()} {exercise.type}</Text>
        <Text className="text-white text-3xl font-bold mb-3 text-center">
          {exercise.name}
        </Text>
        <Text className="text-white/80 text-sm mb-10 text-center">
          {exercise.description}
        </Text>

        {/* Cercle de respiration animé */}
        {exercise.type === 'respiration' && (
          <View className="items-center justify-center mb-10">
            <Animated.View
              style={[
                animatedStyle,
                {
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: getPhaseColor(),
                },
              ]}
            />
            
            {isRunning && (
              <View className="absolute items-center">
                <Text className="text-white text-6xl font-bold mb-2">
                  {countdown}
                </Text>
                <Text className="text-white/90 text-lg font-semibold">
                  {getPhaseText()}
                </Text>
              </View>
            )}

            {!isRunning && currentPhase === 'pause' && (
              <View className="absolute items-center">
                <Text className="text-white text-4xl mb-2">🌬️</Text>
                <Text className="text-white/90 text-lg font-semibold">
                  Prêt à commencer
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Affichage pour autres types */}
        {exercise.type !== 'respiration' && exercise.steps && (
          <View className="bg-white/10 rounded-3xl p-6 mb-8 w-full">
            <Text className="text-white font-bold mb-4">Étapes :</Text>
            {exercise.steps.map((step, index) => (
              <View key={index} className="flex-row mb-3">
                <Text className="text-white/70 mr-3">{index + 1}.</Text>
                <Text className="text-white/90 flex-1">{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats en temps réel */}
        {isRunning && exercise.type === 'respiration' && (
          <View className="bg-white/10 rounded-2xl px-6 py-3 mb-6">
            <Text className="text-white/70 text-sm text-center">
              Cycle {cycleCount} • {Math.floor(elapsedTime / 60)} min {elapsedTime % 60}s
            </Text>
          </View>
        )}

        {/* Boutons de contrôle */}
        <View className="w-full px-6">
          {!isRunning && currentPhase === 'pause' && (
            <Button
              title="Commencer"
              onPress={startExercise}
              variant="primary"
              fullWidth
              className="bg-green-600"
              icon={<Ionicons name="play" size={20} color="#ffffff" />}
            />
          )}

          {!isRunning && currentPhase !== 'pause' && (
            <View className="gap-3">
              <Button
                title="Reprendre"
                onPress={resumeExercise}
                variant="primary"
                fullWidth
                className="bg-green-600"
                icon={<Ionicons name="play" size={20} color="#ffffff" />}
              />
              <Button
                title="Terminer la session"
                onPress={stopExercise}
                variant="outline"
                fullWidth
              />
            </View>
          )}

          {isRunning && (
            <Button
              title="Pause"
              onPress={pauseExercise}
              variant="secondary"
              fullWidth
              className="bg-yellow-600"
              icon={<Ionicons name="pause" size={20} color="#ffffff" />}
            />
          )}
        </View>
      </View>

      {/* Benefits footer */}
      <View className="px-8 pb-8">
        <Text className="text-white/70 text-xs mb-2 text-center">Bienfaits :</Text>
        <Text className="text-white/90 text-sm text-center">
          {exercise.benefits.join(' • ')}
        </Text>
      </View>
    </View>
  );
};

