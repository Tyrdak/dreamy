// Écran des rituels du sommeil amélioré
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseCard, FilterTabs, QuoteCard } from '../components/rituals';
import { fetchAffirmation } from '../services';
import { getRitualsData, updateDailyAffirmation } from '../storage';
import { EXERCISES, ExerciseType, RitualsData } from '../types';

interface RitualsScreenProps {
  navigation: any;
}

export const RitualsScreen: React.FC<RitualsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [rituals, setRituals] = useState<RitualsData | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [loadingAffirmation, setLoadingAffirmation] = useState(false);
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const ritualsData = await getRitualsData();
    setRituals(ritualsData);

    const today = new Date().toISOString().split('T')[0];
    const lastAffirmationDate = ritualsData.lastAffirmationDate
      ? new Date(ritualsData.lastAffirmationDate).toISOString().split('T')[0]
      : null;

    if (ritualsData.dailyAffirmation && lastAffirmationDate === today) {
      setAffirmation(ritualsData.dailyAffirmation);
    } else {
      loadNewAffirmation();
    }
  };

  const loadNewAffirmation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoadingAffirmation(true);
    try {
      const newAffirmation = await fetchAffirmation();
      setAffirmation(newAffirmation);
      await updateDailyAffirmation(newAffirmation);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'affirmation:', error);
      setAffirmation('Je suis capable de réaliser mes rêves et d\'atteindre mes objectifs.');
    } finally {
      setLoadingAffirmation(false);
    }
  };

  const getRecommendedExercise = () => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      return EXERCISES.find((ex) => ex.id === 'breathing_478') || EXERCISES[0];
    } else if (hour >= 18) {
      return EXERCISES.find((ex) => ex.id === 'meditation_gratitude') || EXERCISES[1];
    }
    return EXERCISES.find((ex) => ex.id === 'breathing_box') || EXERCISES[2];
  };

  const recommendedExercise = getRecommendedExercise();
  const hasCompletedToday = rituals?.completedExercises?.some(
    (session) => session.date === new Date().toISOString().split('T')[0]
  );
  const filteredExercises = selectedType === 'all' ? EXERCISES : EXERCISES.filter((ex) => ex.type === selectedType);

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View
        style={{ paddingTop: insets.top + 12, backgroundColor: '#312e81' }}
        className="pb-4 px-6 shadow-lg"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fef08a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
            Rituels & Bien-être
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {hasCompletedToday && (
          <View className="bg-green-500/20 rounded-2xl p-3 mb-2">
            <Text className="text-green-100 text-center font-semibold">
              ✅ Vous avez complété un exercice aujourd'hui !
            </Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1">
        <QuoteCard affirmation={affirmation} loading={loadingAffirmation} onRefresh={loadNewAffirmation} />

        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-2">
            📚 Exercices disponibles
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-sm">
            {EXERCISES.length} pratiques pour améliorer votre sommeil
          </Text>
        </View>

        <FilterTabs selected={selectedType} onSelect={setSelectedType} />

        <View className="px-6 mt-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => navigation.navigate('Exercise', { exerciseId: exercise.id })}
              isRecommended={exercise.id === recommendedExercise.id}
            />
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
