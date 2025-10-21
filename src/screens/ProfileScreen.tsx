// Écran de profil utilisateur avec statistiques

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDreams, getDreamStreak, getUserBadges, getUserProfile } from '../storage';
import { DreamStatistics, DreamStreak, UserBadges, UserProfile } from '../types';
import { calculateDreamStatistics } from '../utils';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DreamStatistics | null>(null);
  const [streak, setStreak] = useState<DreamStreak | null>(null);
  const [badges, setBadges] = useState<UserBadges | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [userProfile, dreams, currentStreak, userBadges] = await Promise.all([
      getUserProfile(),
      getDreams(),
      getDreamStreak(),
      getUserBadges(),
    ]);
    
    const statistics = calculateDreamStatistics(dreams);
    
    setProfile(userProfile);
    setStats(statistics);
    setStreak(currentStreak);
    setBadges(userBadges);
    setLoading(false);
  };

  if (loading || !profile || !stats) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-primary-600 text-lg">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
            Profil
          </Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="#7c6df1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Avatar et info utilisateur */}
        <View className="bg-white dark:bg-dream-dusk mx-6 mt-6 rounded-2xl p-6 shadow-lg items-center">
          <View className="bg-primary-100 dark:bg-primary-900 rounded-full w-24 h-24 items-center justify-center mb-4">
            <Text className="text-6xl">{profile.avatar || '😴'}</Text>
          </View>
          
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-2">
            {profile.username}
          </Text>
          
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        {/* Streak et Badges */}
        {streak && streak.currentStreak > 0 && (
          <View className="px-6 mt-6">
            <View className="bg-primary-600 rounded-2xl p-5 shadow-lg">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-4xl mr-3">🔥</Text>
                  <View>
                    <Text className="text-white text-2xl font-bold">
                      {streak.currentStreak} jours
                    </Text>
                    <Text className="text-white/80 text-sm">
                      Série en cours
                    </Text>
                  </View>
                </View>
                {streak.longestStreak > streak.currentStreak && (
                  <View className="items-end">
                    <Text className="text-white/60 text-xs">Record</Text>
                    <Text className="text-white font-bold">{streak.longestStreak} 🏆</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {badges && badges.totalUnlocked > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Badges')}
            className="px-6 mt-4"
          >
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-5 shadow-lg">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-3xl mr-3">🏆</Text>
                  <View>
                    <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg">
                      {badges.totalUnlocked} Badges
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      Voir tous vos trophées
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#7c6df1" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Statistiques rapides */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            📊 Statistiques
          </Text>
          
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stats.totalDreams}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Rêves enregistrés
              </Text>
            </View>
            
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stats.averageClarity.toFixed(1)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Clarté moyenne
              </Text>
            </View>
          </View>

          <View className="flex-row space-x-4 mb-6">
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {stats.averageIntensity.toFixed(1)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Intensité moyenne
              </Text>
            </View>
            
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {Object.keys(stats.dreamsByMoonPhase).length}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Phases lunaires
              </Text>
            </View>
          </View>
        </View>

        {/* Types de rêves */}
        {stats.totalDreams > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🌈 Répartition des types
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              {Object.entries(stats.dreamsByType).map(([type, count]) => {
                if (count === 0) return null;
                const percentage = (count / stats.totalDreams) * 100;
                
                return (
                  <View key={type} className="mb-3 last:mb-0">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-dream-night dark:text-dream-cloud capitalize">
                        {type}
                      </Text>
                      <Text className="text-gray-500 dark:text-gray-400">
                        {count} ({percentage.toFixed(0)}%)
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Tonalités */}
        {stats.totalDreams > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🎭 Tonalités
            </Text>
            
            <View className="flex-row space-x-4">
              {Object.entries(stats.dreamsByTone).map(([tone, count]) => {
                if (count === 0) return null;
                const percentage = (count / stats.totalDreams) * 100;
                
                const colors = {
                  positive: 'bg-green-100 dark:bg-green-900 border-green-500',
                  neutre: 'bg-gray-100 dark:bg-gray-800 border-gray-500',
                  négative: 'bg-red-100 dark:bg-red-900 border-red-500',
                };
                
                return (
                  <View key={tone} className={`flex-1 ${colors[tone as keyof typeof colors]} rounded-2xl p-4 border-2`}>
                    <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-1">
                      {count}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm capitalize">
                      {tone}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Tags les plus fréquents */}
        {stats.mostCommonTags.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🏷️ Tags populaires
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
              <View className="flex-row flex-wrap">
                {stats.mostCommonTags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-2 mr-2 mb-2"
                  >
                    <Text className="text-primary-700 dark:text-primary-300">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Explorer */}
        <View className="px-6 mt-2 mb-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            🌟 Explorer
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => navigation.navigate('Constellation')}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">⭐</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Constellation de Rêves
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    Vue graphique de vos rêves
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LunarJournal')}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">🌙</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Journal Lunaire
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    Influence des phases lunaires
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Rituals')}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">🧘</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Rituels du Sommeil
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    Citations et respiration
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

