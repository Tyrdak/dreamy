// Écran des statistiques avec visualisations
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarChart, DonutChart, InsightCard, StatCard, ToneCard, WeeklyChart } from '../components/analytics';
import { getDreams } from '../storage';
import { Dream, DreamStatistics } from '../types';
import { analyzeKeywords, calculateDreamStatistics } from '../utils';

interface InsightsScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<DreamStatistics | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [keywords, setKeywords] = useState<{ word: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const loadStats = async () => {
    const loadedDreams = await getDreams();
    const statistics = calculateDreamStatistics(loadedDreams);
    const dreamKeywords = analyzeKeywords(loadedDreams);
    
    setDreams(loadedDreams);
    setStats(statistics);
    setKeywords(dreamKeywords);
    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    loadStats();
    const unsubscribe = navigation?.addListener?.('focus', () => loadStats());
    return unsubscribe;
  }, [navigation]);

  const getPersonalizedMessage = (): string => {
    if (!stats || stats.totalDreams === 0) return '';
    const messages = [
      `Vous avez exploré ${stats.totalDreams} univers oniriques ! 🌟`,
      `${stats.totalDreams} rêves enregistrés, c'est magnifique ! ✨`,
    ];
    if (stats.averageClarity >= 7) {
      messages.push("Vos rêves sont remarquablement clairs !");
    }
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getWeeklyTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    return last7Days.map(date => ({
      date,
      count: dreams.filter(d => d.date.startsWith(date)).length,
    }));
  };

  if (loading || !stats) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-6xl mb-4">📊</Text>
        <Text className="text-primary-600 text-lg font-semibold">Analyse en cours...</Text>
      </View>
    );
  }

  if (stats.totalDreams === 0) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
        <View style={{ paddingTop: insets.top + 12 }} className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#7c6df1" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">Analytics</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-8xl mb-6">🌙</Text>
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-3 text-center">
            Votre voyage commence ici
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
            Notez vos rêves pour découvrir des insights fascinants
          </Text>
        </View>
      </View>
    );
  }

  const dreamTypeData = Object.entries(stats.dreamsByType)
    .filter(([_, count]) => count > 0)
    .map(([type, count], index) => ({
      label: type,
      value: count,
      color: ['#7c6df1', '#6d28d9', '#a78bfa', '#f59e0b', '#10b981'][index % 5],
    }));

  const emotionData = stats.mostCommonEmotions.slice(0, 5).map((emotion) => {
    const config: Record<string, { emoji: string; color: string }> = {
      joyeux: { emoji: '😊', color: '#10b981' },
      calme: { emoji: '😌', color: '#3b82f6' },
      anxieux: { emoji: '😰', color: '#f59e0b' },
      triste: { emoji: '😢', color: '#6366f1' },
      excité: { emoji: '🤩', color: '#ec4899' },
      confus: { emoji: '😕', color: '#8b5cf6' },
      neutre: { emoji: '😐', color: '#6b7280' },
    };
    const c = config[emotion] || { emoji: '😐', color: '#6b7280' };
    const count = dreams.filter(d => d.emotionalStateBefore === emotion || d.emotionalStateAfter === emotion).length;
    return {
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: count,
      emoji: c.emoji,
      color: c.color,
    };
  });

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View style={{ paddingTop: insets.top + 12 }} className="bg-primary-600 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Analytics</Text>
          <TouchableOpacity onPress={loadStats}>
            <Ionicons name="refresh" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View className="bg-white/20 rounded-2xl p-4">
          <Text className="text-white text-sm">{getPersonalizedMessage()}</Text>
        </View>
      </View>

      <Animated.ScrollView style={{ opacity: fadeAnim }}>
        <View className="px-6 mt-6">
          <View className="flex-row gap-3">
            <StatCard emoji="📚" label="TOTAL" value={stats.totalDreams} subtitle="Rêves enregistrés" />
            <StatCard emoji="✨" label="CLARTÉ" value={stats.averageClarity.toFixed(1)} subtitle="Moyenne sur 10" badgeColor="bg-yellow-100 dark:bg-yellow-900" badgeText="CLARTÉ" />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-3">📈 Votre semaine</Text>
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
            <WeeklyChart data={getWeeklyTrend()} width={CHART_WIDTH} height={220} />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-3">🎭 Types de rêves</Text>
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
            <DonutChart data={dreamTypeData} width={CHART_WIDTH} />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-3">🎨 Tonalités</Text>
          <View className="flex-row gap-3">
            {Object.entries(stats.dreamsByTone).map(([tone, count]) => {
              if (count === 0) return null;
              const configs = {
                positive: { icon: '😊', label: 'Positive', bgColor: 'bg-green-50 dark:bg-green-900/30', borderColor: 'border-green-200', textColor: 'text-green-700 dark:text-green-300' },
                neutre: { icon: '😐', label: 'Neutre', bgColor: 'bg-gray-50 dark:bg-gray-800/30', borderColor: 'border-gray-200', textColor: 'text-gray-700 dark:text-gray-300' },
                négative: { icon: '😔', label: 'Négative', bgColor: 'bg-red-50 dark:bg-red-900/30', borderColor: 'border-red-200', textColor: 'text-red-700 dark:text-red-300' },
              };
              const config = configs[tone as keyof typeof configs];
              return <ToneCard key={tone} {...config} count={count} percentage={(count / stats.totalDreams) * 100} />;
            })}
          </View>
        </View>

        {emotionData.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-3">💫 Émotions</Text>
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 shadow-lg">
              <BarChart data={emotionData} width={CHART_WIDTH} />
            </View>
          </View>
        )}

        <View className="px-6 mt-6 mb-8">
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-3">💡 Insights</Text>
          {stats.averageClarity >= 7 && (
            <InsightCard
              emoji="✨"
              title="Mémoire exceptionnelle"
              description={`Clarté de ${stats.averageClarity.toFixed(1)}/10 ! Vous vous souvenez remarquablement bien de vos rêves.`}
              gradientFrom="bg-yellow-50"
              gradientTo="dark:bg-yellow-900/20"
              borderColor="border-yellow-200"
              textColor="text-yellow-900 dark:text-yellow-100"
            />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

