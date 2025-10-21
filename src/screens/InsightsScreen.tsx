// Écran des statistiques détaillées avec visualisations

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getDreams } from '../storage';
import { DreamStatistics } from '../types';
import { analyzeKeywords, calculateDreamStatistics, findRecurringThemes } from '../utils';

interface InsightsScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState<DreamStatistics | null>(null);
  const [keywords, setKeywords] = useState<{ word: string; count: number }[]>([]);
  const [themes, setThemes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const dreams = await getDreams();
    const statistics = calculateDreamStatistics(dreams);
    const dreamKeywords = analyzeKeywords(dreams);
    const recurringThemes = findRecurringThemes(dreams);
    
    setStats(statistics);
    setKeywords(dreamKeywords);
    setThemes(recurringThemes);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-primary-600 text-lg">Chargement des statistiques...</Text>
      </View>
    );
  }

  if (stats.totalDreams === 0) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
        <View className="bg-white dark:bg-dream-dusk pt-12 pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#7c6df1" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
              Statistiques
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-6xl mb-4">📊</Text>
          <Text className="text-xl font-semibold text-dream-night dark:text-dream-cloud mb-2 text-center">
            Pas encore de statistiques
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            Commencez à enregistrer vos rêves pour voir vos statistiques
          </Text>
        </View>
      </View>
    );
  }

  const chartColors = ['#7c6df1', '#6d28d9', '#a78bfa', '#c7d4fe', '#e0e8ff'];

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View className="bg-white dark:bg-dream-dusk pt-12 pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
            Statistiques détaillées
          </Text>
          
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Vue d'ensemble */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            📈 Vue d'ensemble
          </Text>
          
          <View className="bg-primary-600 rounded-2xl p-6 shadow-lg mb-4">
            <Text className="text-white text-5xl font-bold mb-2">
              {stats.totalDreams}
            </Text>
            <Text className="text-white/80 text-lg mb-4">
              Rêves enregistrés au total
            </Text>
            
            <View className="flex-row justify-between">
              <View>
                <Text className="text-white/80 text-sm">Clarté moyenne</Text>
                <Text className="text-white text-2xl font-bold">
                  {stats.averageClarity.toFixed(1)}/10
                </Text>
              </View>
              <View>
                <Text className="text-white/80 text-sm">Intensité moyenne</Text>
                <Text className="text-white text-2xl font-bold">
                  {stats.averageIntensity.toFixed(1)}/10
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Types de rêves */}
        <View className="px-6 mt-2">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            🎭 Répartition par type
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
            {Object.entries(stats.dreamsByType).map(([type, count], index) => {
              if (count === 0) return null;
              const percentage = (count / stats.totalDreams) * 100;
              
              return (
                <View key={type} className="mb-4 last:mb-0">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
                      {type}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 dark:text-gray-400 mr-2">
                        {count}
                      </Text>
                      <Text className="text-primary-600 dark:text-primary-400 font-bold">
                        {percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  
                  <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: chartColors[index % chartColors.length],
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tonalités */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            😊 Analyse des tonalités
          </Text>
          
          <View className="flex-row space-x-4">
            {Object.entries(stats.dreamsByTone).map(([tone, count]) => {
              if (count === 0) return null;
              const percentage = (count / stats.totalDreams) * 100;
              
              const toneConfig = {
                positive: {
                  color: 'bg-green-500',
                  bgColor: 'bg-green-100 dark:bg-green-900',
                  icon: '😊',
                  label: 'Positive',
                },
                neutre: {
                  color: 'bg-gray-500',
                  bgColor: 'bg-gray-100 dark:bg-gray-800',
                  icon: '😐',
                  label: 'Neutre',
                },
                négative: {
                  color: 'bg-red-500',
                  bgColor: 'bg-red-100 dark:bg-red-900',
                  icon: '😔',
                  label: 'Négative',
                },
              };
              
              const config = toneConfig[tone as keyof typeof toneConfig];
              
              return (
                <View key={tone} className={`flex-1 ${config.bgColor} rounded-2xl p-4`}>
                  <Text className="text-3xl mb-2 text-center">{config.icon}</Text>
                  <Text className="text-dream-night dark:text-dream-cloud font-bold text-2xl text-center mb-1">
                    {count}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm text-center mb-1">
                    {config.label}
                  </Text>
                  <Text className="text-gray-500 text-xs text-center">
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Phases lunaires */}
        {Object.keys(stats.dreamsByMoonPhase).length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🌙 Rêves par phase lunaire
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              {Object.entries(stats.dreamsByMoonPhase)
                .sort((a, b) => b[1] - a[1])
                .map(([phase, count], index) => {
                  const percentage = (count / stats.totalDreams) * 100;
                  
                  return (
                    <View key={phase} className="mb-3 last:mb-0">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-dream-night dark:text-dream-cloud">
                          {phase}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400">
                          {count} ({percentage.toFixed(0)}%)
                        </Text>
                      </View>
                      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Émotions récurrentes */}
        {stats.mostCommonEmotions.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              💖 Émotions récurrentes
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              <View className="flex-row flex-wrap justify-center">
                {stats.mostCommonEmotions.map((emotion, index) => {
                  const emotionIcons: Record<string, string> = {
                    joyeux: '😊',
                    calme: '😌',
                    anxieux: '😰',
                    triste: '😢',
                    excité: '🤩',
                    confus: '😕',
                    neutre: '😐',
                  };
                  
                  return (
                    <View
                      key={emotion}
                      className="bg-primary-100 dark:bg-primary-900 rounded-2xl p-4 m-2 items-center min-w-[100px]"
                    >
                      <Text className="text-4xl mb-2">{emotionIcons[emotion]}</Text>
                      <Text className="text-primary-700 dark:text-primary-300 font-semibold capitalize">
                        {emotion}
                      </Text>
                      <Text className="text-primary-600 dark:text-primary-400 text-xs mt-1">
                        Top {index + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Mots-clés récurrents */}
        {keywords.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🔤 Mots-clés les plus fréquents
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              <View className="flex-row flex-wrap">
                {keywords.slice(0, 15).map((keyword, index) => {
                  const fontSize = 12 + (15 - index) * 0.5; // Taille variable
                  return (
                    <View
                      key={keyword.word}
                      className="m-1"
                    >
                      <Text
                        style={{ fontSize }}
                        className="text-primary-600 dark:text-primary-400 font-semibold"
                      >
                        {keyword.word} ({keyword.count})
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Thèmes récurrents */}
        {Object.keys(themes).length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🎭 Thèmes dans vos rêves
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              {Object.entries(themes)
                .sort((a, b) => b[1] - a[1])
                .map(([theme, count]) => {
                  const themeEmojis: Record<string, string> = {
                    'Eau': '🌊',
                    'Vol': '🕊️',
                    'Poursuite': '🏃',
                    'Famille': '👨‍👩‍👧',
                    'Maison': '🏠',
                    'École/Travail': '📚',
                    'Animaux': '🐾',
                    'Mort': '💀',
                  };

                  return (
                    <View key={theme} className="flex-row items-center justify-between mb-3 last:mb-0">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-2xl mr-3">{themeEmojis[theme]}</Text>
                        <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                          {theme}
                        </Text>
                      </View>
                      <View className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1">
                        <Text className="text-primary-700 dark:text-primary-300 font-bold">
                          {count}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Tags populaires */}
        {stats.mostCommonTags.length > 0 && (
          <View className="px-6 mt-6 mb-8">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🏷️ Vos tags
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              <View className="flex-row flex-wrap">
                {stats.mostCommonTags.map((tag) => (
                  <View
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 m-1"
                  >
                    <Text className="text-gray-700 dark:text-gray-300 font-medium">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

