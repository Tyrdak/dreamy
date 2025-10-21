// Écran d'accueil - Dashboard

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DreamCard, StreakCard } from '../components';
import { getMoonPhase } from '../services';
import { getDreams, getDreamStreak, getUserProfile } from '../storage';
import { Dream, DreamStreak } from '../types';
import { calculateDreamStatistics } from '../utils';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [streak, setStreak] = useState<DreamStreak | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<any>(null);
  const moonPhase = getMoonPhase(new Date());

  // Messages d'accueil variés et naturels
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return `Insomnie, ${username} ? 😴`;
    if (hour < 12) return `Bonjour ${username} ☀️`;
    if (hour < 14) return `Bon appétit ${username} !`;
    if (hour < 18) return `Salut ${username} 👋`;
    if (hour < 22) return `Bonsoir ${username}`;
    return `Bonne nuit ${username} 🌙`;
  };

  const getSubtitle = () => {
    const subtitles = [
      "Qu'avez-vous en tête ?",
      "On explore quoi aujourd'hui ?",
      "Par où on commence ?",
      "Qu'est-ce qui vous tente ?",
    ];
    return subtitles[Math.floor(Math.random() * subtitles.length)];
  };

  // Charge le profil utilisateur
  const loadUserProfile = async () => {
    const profile = await getUserProfile();
    if (profile) {
      setUsername(profile.username);
    }
  };

  // Charge le streak
  const loadStreak = async () => {
    const currentStreak = await getDreamStreak();
    setStreak(currentStreak);
  };


  // Charge les rêves et stats
  const loadDreams = async () => {
    const allDreams = await getDreams();
    setDreams(allDreams);
    const statistics = calculateDreamStatistics(allDreams);
    setStats(statistics);
  };

  // Charge les données au focus de l'écran
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
      loadStreak();
      loadDreams();
    }, [])
  );

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-5 px-6"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-dream-night dark:text-dream-cloud mb-1">
              {username ? getGreeting() : 'Bienvenue 👋'}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {getSubtitle()}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            className="bg-primary-100 dark:bg-primary-900 rounded-2xl w-12 h-12 items-center justify-center mt-1"
          >
            <Ionicons name="person" size={24} color="#7c6df1" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Phase lunaire du jour */}
        <View className="px-6 mt-5">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-lg border border-primary-100 dark:border-primary-900">
            <View className="flex-row items-center">
              <Text className="text-6xl mr-4">{moonPhase.emoji}</Text>
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                  Phase lunaire actuelle
                </Text>
                <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-1">
                  {moonPhase.phaseName}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs">
                  {moonPhase.illumination}% illuminée
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Card */}
        {streak && streak.currentStreak > 0 && (
          <View className="mt-4">
            <StreakCard streak={streak} />
          </View>
        )}


        {/* Message de bienvenue pour premier rêve */}
        {dreams.length === 0 && (
          <View className="px-6 mt-5">
            <View className="bg-white dark:bg-dream-dusk rounded-3xl p-6 shadow-lg border-2 border-primary-300 dark:border-primary-700">
              <View className="items-center mb-4">
                <Text className="text-6xl mb-3">🌟</Text>
                <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud text-center mb-2">
                  Bienvenue dans votre journal de rêves !
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-5">
                  Vous n'avez pas encore enregistré de rêve.{'\n'}
                  Commencez votre aventure onirique maintenant !
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('AddDream')}
                className="bg-primary-600 rounded-2xl py-4 px-6 shadow-md active:bg-primary-700"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="add-circle" size={24} color="white" />
                  <Text className="text-white font-bold text-base ml-2">
                    Enregistrer mon premier rêve
                  </Text>
                </View>
              </TouchableOpacity>
              
              <View className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-3">
                <Text className="text-primary-700 dark:text-primary-300 text-xs text-center">
                  💡 Conseil : Notez vos rêves dès le réveil, quand ils sont encore frais dans votre mémoire !
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats rapides */}
        {stats && stats.totalDreams > 0 && (
          <View className="px-6 mt-4">
            <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
              Vos stats en bref
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow">
                <Text className="text-2xl font-bold text-primary-600 mb-1">
                  {stats.totalDreams}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs">Rêves</Text>
              </View>
              <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow">
                <Text className="text-2xl font-bold text-primary-600 mb-1">
                  {stats.averageClarity.toFixed(1)}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs">Clarté moy.</Text>
              </View>
              <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow">
                <Text className="text-2xl font-bold text-primary-600 mb-1">
                  {Object.keys(stats.dreamsByMoonPhase).length}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-xs">Phases</Text>
              </View>
            </View>
          </View>
        )}

        {/* Derniers rêves */}
        {dreams.length > 0 && (
          <View className="px-6 mt-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud">
                Derniers rêves
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('List')}>
                <Text className="text-primary-600 text-sm font-medium">Tout voir →</Text>
              </TouchableOpacity>
            </View>
            
            {dreams.slice(0, 2).map(dream => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onPress={() => navigation.navigate('DreamDetails', { dreamId: dream.id })}
              />
            ))}
          </View>
        )}

        {/* Section principale */}
        <View className="px-6 mt-5">
          <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
            Explorer autrement
          </Text>

          {/* Grid simplifié */}
          <View className="gap-3">
            {/* Ligne 1 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => navigation.navigate('Calendar')}
                className="flex-1 bg-primary-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">📅</Text>
                <Text className="text-white font-bold">Calendrier</Text>
                <Text className="text-white/70 text-xs mt-1">Par dates</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Constellation')}
                className="flex-1 bg-purple-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">⭐</Text>
                <Text className="text-white font-bold">Constellation</Text>
                <Text className="text-white/70 text-xs mt-1">En étoiles</Text>
              </TouchableOpacity>
            </View>

            {/* Ligne 2 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => navigation.navigate('LunarJournal')}
                className="flex-1 bg-yellow-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">🌙</Text>
                <Text className="text-white font-bold">Lune</Text>
                <Text className="text-white/70 text-xs mt-1">Phases</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Insights')}
                className="flex-1 bg-indigo-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">📊</Text>
                <Text className="text-white font-bold">Stats</Text>
                <Text className="text-white/70 text-xs mt-1">Analyses</Text>
              </TouchableOpacity>
            </View>

            {/* Ligne 3 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => navigation.navigate('Badges')}
                className="flex-1 bg-green-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">🏆</Text>
                <Text className="text-white font-bold">Badges</Text>
                <Text className="text-white/70 text-xs mt-1">Trophées</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Rituals')}
                className="flex-1 bg-blue-600 rounded-3xl p-5 shadow-lg"
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">🧘</Text>
                <Text className="text-white font-bold">Zen</Text>
                <Text className="text-white/70 text-xs mt-1">Relaxation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};
