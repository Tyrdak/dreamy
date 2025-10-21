// Écran des rituels du sommeil amélioré

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchDailyQuote } from '../services';
import { getRitualsData, updateDailyQuote } from '../storage';
import { DailyQuote, EXERCISES, ExerciseType, RitualsData } from '../types';

interface RitualsScreenProps {
  navigation: any;
}

export const RitualsScreen: React.FC<RitualsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [rituals, setRituals] = useState<RitualsData | null>(null);
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const ritualsData = await getRitualsData();
    setRituals(ritualsData);

    // Vérifie si on a déjà une citation pour aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const lastQuoteDate = ritualsData.lastQuoteDate
      ? new Date(ritualsData.lastQuoteDate).toISOString().split('T')[0]
      : null;

    if (ritualsData.dailyQuote && lastQuoteDate === today) {
      setQuote(ritualsData.dailyQuote);
    } else {
      loadNewQuote();
    }
  };

  const loadNewQuote = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoadingQuote(true);
    const newQuote = await fetchDailyQuote();
    setQuote(newQuote);
    await updateDailyQuote(newQuote);
    setLoadingQuote(false);
  };

  const filteredExercises = selectedType === 'all' 
    ? EXERCISES 
    : EXERCISES.filter(ex => ex.type === selectedType);

  // Recommandation selon l'heure
  const getRecommendedExercise = () => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      // Nuit - relaxation profonde
      return EXERCISES.find(ex => ex.id === 'breathing_478') || EXERCISES[0];
    } else if (hour >= 18) {
      // Soir - détente
      return EXERCISES.find(ex => ex.id === 'meditation_gratitude') || EXERCISES[1];
    } else {
      // Journée - box breathing
      return EXERCISES.find(ex => ex.id === 'breathing_box') || EXERCISES[2];
    }
  };

  const recommendedExercise = getRecommendedExercise();
  
  const hasCompletedToday = rituals?.completedExercises?.some(
    session => session.date === new Date().toISOString().split('T')[0]
  );

  const getTypeEmoji = (type: ExerciseType) => {
    const emojis = {
      respiration: '🌬️',
      meditation: '🧘',
      visualisation: '🌅',
      relaxation: '😌',
    };
    return emojis[type];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'text-green-600';
      case 'moyen': return 'text-yellow-600';
      case 'avancé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-5 px-6"
      >
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
              Zen & Bien-être
            </Text>
          </View>

          <View style={{ width: 24 }} />
        </View>
        
        <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
          Prenez soin de vous avant de dormir
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Citation du jour - En premier */}
        <View className="px-6 mt-5">
          <View className="bg-primary-600 rounded-3xl p-6 shadow-lg">
            {quote && !loadingQuote ? (
              <>
                <Text className="text-white/60 text-xs mb-3 text-center">💭 Citation du jour</Text>
                <Text className="text-white text-base italic leading-6 mb-4 text-center">
                  "{quote.text}"
                </Text>
                <Text className="text-white/70 text-sm text-right mb-3">
                  — {quote.author}
                </Text>
                <TouchableOpacity
                  onPress={loadNewQuote}
                  className="bg-white/20 rounded-full py-2 px-5 self-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-medium text-sm">
                    ♻️ Nouvelle citation
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-white text-center">Chargement...</Text>
            )}
          </View>
        </View>

        {/* Streak d'exercices */}
        {rituals && rituals.exerciseStreak && rituals.exerciseStreak.currentStreak > 0 && (
          <View className="px-6 mt-4">
            <View className="bg-blue-600 rounded-3xl p-5 shadow-lg">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-4xl mr-3">🔥</Text>
                  <View>
                    <Text className="text-white text-xl font-bold">
                      {rituals.exerciseStreak.currentStreak} {rituals.exerciseStreak.currentStreak === 1 ? 'jour' : 'jours'}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      de pratique quotidienne !
                    </Text>
                  </View>
                </View>
                <View className="bg-white/20 rounded-2xl px-3 py-2">
                  <Text className="text-white/70 text-xs">Total</Text>
                  <Text className="text-white font-bold text-center">{rituals.exerciseStreak.totalSessions}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recommandation */}
        {!hasCompletedToday && (
          <View className="px-6 mt-4">
            <View className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-5 border-2 border-green-200 dark:border-green-800">
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-2">💡</Text>
                <Text className="text-green-800 dark:text-green-300 font-bold text-base">
                  Recommandé maintenant
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate('Exercise', { exercise: recommendedExercise });
                }}
                className="bg-white dark:bg-green-900 rounded-2xl p-4"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-dream-night dark:text-green-200 font-bold mb-1">
                      {recommendedExercise.name}
                    </Text>
                    <Text className="text-gray-600 dark:text-green-300/70 text-sm">
                      {Math.floor(recommendedExercise.duration / 60)} min • {recommendedExercise.difficulty}
                    </Text>
                  </View>
                  <View className="bg-green-600 rounded-full w-12 h-12 items-center justify-center">
                    <Ionicons name="play" size={24} color="#ffffff" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Aujourd'hui complété */}
        {hasCompletedToday && (
          <View className="px-6 mt-4">
            <View className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 flex-row items-center">
              <Text className="text-3xl mr-3">✅</Text>
              <Text className="text-green-800 dark:text-green-300 font-medium flex-1">
                Exercice du jour complété ! Bravo 🎉
              </Text>
            </View>
          </View>
        )}

        {/* Filtres par type */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
              Tous les exercices
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {filteredExercises.length}
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-5"
            contentContainerStyle={{ gap: 8 }}
          >
            {(['all', 'respiration', 'meditation', 'visualisation', 'relaxation'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedType(type);
                }}
                className={`
                  px-5 py-2.5 rounded-full
                  ${selectedType === type 
                    ? 'bg-primary-600' 
                    : 'bg-white dark:bg-dream-dusk border border-gray-300 dark:border-gray-600'}
                `.trim()}
                activeOpacity={0.7}
              >
                <Text
                  className={
                    selectedType === type
                      ? 'text-white font-semibold text-sm'
                      : 'text-gray-700 dark:text-gray-300 text-sm'
                  }
                >
                  {type === 'all' ? '✨ Tous' : `${getTypeEmoji(type as ExerciseType)} ${type}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Liste des exercices */}
          <View className="gap-4">
            {filteredExercises.map((exercise, index) => (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate('Exercise', { exercise });
                }}
                className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-lg"
                activeOpacity={0.7}
              >
                {/* Header de la carte */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-primary-100 dark:bg-primary-900 rounded-2xl w-14 h-14 items-center justify-center mr-3">
                      <Text className="text-3xl">{getTypeEmoji(exercise.type)}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-dream-night dark:text-dream-cloud font-bold text-base mb-1">
                        {exercise.name}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#7c6df1" />
                          <Text className="text-primary-600 dark:text-primary-400 text-xs ml-1 font-medium">
                            {Math.floor(exercise.duration / 60)} min
                          </Text>
                        </View>
                        <Text className="text-gray-400">•</Text>
                        <Text className={`text-xs font-semibold capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="bg-primary-600 rounded-full w-10 h-10 items-center justify-center">
                    <Ionicons name="play" size={20} color="#ffffff" />
                  </View>
                </View>

                {/* Description */}
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-5">
                  {exercise.description}
                </Text>

                {/* Bienfaits */}
                <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
                  <Text className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">
                    ✨ Bienfaits
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {exercise.benefits.slice(0, 3).map((benefit, i) => (
                      <View key={i} className="bg-white dark:bg-gray-700 rounded-full px-3 py-1">
                        <Text className="text-gray-700 dark:text-gray-300 text-xs">
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
