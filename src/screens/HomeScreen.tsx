// Écran d'accueil - Dashboard
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DreamCard, StreakCard } from '../components';
import { AffirmationCard, ExploreGrid, QuickStats, WelcomeCard } from '../components/home';
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

  const loadUserProfile = async () => {
    const profile = await getUserProfile();
    if (profile) setUsername(profile.username);
  };

  const loadStreak = async () => {
    setStreak(await getDreamStreak());
  };

  const loadDreams = async () => {
    const allDreams = await getDreams();
    setDreams(allDreams);
    setStats(calculateDreamStatistics(allDreams));
  };

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
      loadStreak();
      loadDreams();
    }, [])
  );

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View style={{ paddingTop: insets.top + 12 }} className="bg-white dark:bg-dream-dusk pb-5 px-6">
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
        <AffirmationCard />

        {streak && streak.currentStreak > 0 && (
          <View className="mt-4">
            <StreakCard streak={streak} />
          </View>
        )}

        {dreams.length === 0 && (
          <View className="px-6 mt-5">
            <WelcomeCard onAddDream={() => navigation.navigate('AddDream')} />
          </View>
        )}

        {stats && stats.totalDreams > 0 && (
          <View className="px-6 mt-4">
            <QuickStats
              totalDreams={stats.totalDreams}
              averageClarity={stats.averageClarity}
            />
          </View>
        )}

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

        <View className="px-6 mt-5">
          <ExploreGrid onNavigate={(screen) => navigation.navigate(screen)} />
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};
