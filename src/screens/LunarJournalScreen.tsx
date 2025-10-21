// Écran du journal lunaire - influence des phases

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMoonPhaseDescription } from '../services';
import { getDreams } from '../storage';
import { Dream } from '../types';

interface LunarJournalScreenProps {
  navigation: any;
}

export const LunarJournalScreen: React.FC<LunarJournalScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [dreamsByMoonPhase, setDreamsByMoonPhase] = useState<Record<string, Dream[]>>({});
  const [stats, setStats] = useState<Record<string, any>>({});

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    const allDreams = await getDreams();
    setDreams(allDreams);

    // Groupe les rêves par phase lunaire
    const grouped: Record<string, Dream[]> = {};
    const phaseStats: Record<string, any> = {};

    allDreams.forEach((dream) => {
      if (dream.moonPhase) {
        if (!grouped[dream.moonPhase]) {
          grouped[dream.moonPhase] = [];
          phaseStats[dream.moonPhase] = {
            count: 0,
            totalIntensity: 0,
            totalClarity: 0,
            lucidCount: 0,
            nightmareCount: 0,
          };
        }
        grouped[dream.moonPhase].push(dream);
        phaseStats[dream.moonPhase].count++;
        phaseStats[dream.moonPhase].totalIntensity += dream.emotionalIntensity;
        phaseStats[dream.moonPhase].totalClarity += dream.clarity;
        if (dream.type === 'lucide') phaseStats[dream.moonPhase].lucidCount++;
        if (dream.type === 'cauchemar') phaseStats[dream.moonPhase].nightmareCount++;
      }
    });

    // Calcule les moyennes
    Object.keys(phaseStats).forEach((phase) => {
      const stats = phaseStats[phase];
      stats.avgIntensity = stats.totalIntensity / stats.count;
      stats.avgClarity = stats.totalClarity / stats.count;
    });

    setDreamsByMoonPhase(grouped);
    setStats(phaseStats);
  };

  const getMostActiveMoonPhase = () => {
    if (Object.keys(stats).length === 0) return null;
    
    const sorted = Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
    return sorted[0];
  };

  const mostActive = getMostActiveMoonPhase();

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
            Journal Lunaire
          </Text>

          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Insight principal */}
        {mostActive && (
          <View className="px-6 mt-6">
            <View className="bg-yellow-500 rounded-3xl p-6 shadow-lg">
              <Text className="text-white text-2xl font-bold mb-3 text-center">
                Votre phase préférée 🌙
              </Text>
              <Text className="text-white/90 text-lg mb-2 text-center">
                {mostActive[0]}
              </Text>
              <Text className="text-white/80 text-sm text-center mb-4">
                {mostActive[1].count} rêves enregistrés
              </Text>
              <Text className="text-white/70 text-xs text-center italic">
                {getMoonPhaseDescription(mostActive[0])}
              </Text>
            </View>
          </View>
        )}

        {/* Rêves par phase */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            🌙 Vos rêves par phase lunaire
          </Text>

          {Object.entries(dreamsByMoonPhase).length === 0 ? (
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-8 items-center">
              <Text className="text-5xl mb-3">🌙</Text>
              <Text className="text-dream-night dark:text-dream-cloud text-center">
                Enregistrez des rêves pour voir les influences lunaires
              </Text>
            </View>
          ) : (
            Object.entries(dreamsByMoonPhase)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([phase, phaseDreams]) => {
                const phaseStats = stats[phase];
                
                return (
                  <View key={phase} className="mb-6">
                    <View className="bg-white dark:bg-dream-dusk rounded-2xl p-5 shadow-lg">
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg">
                          {phase}
                        </Text>
                        <Text className="text-primary-600 dark:text-primary-400 font-bold">
                          {phaseDreams.length} rêves
                        </Text>
                      </View>

                      {/* Statistiques de cette phase */}
                      <View className="flex-row justify-around mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <View className="items-center">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                            Intensité moy.
                          </Text>
                          <Text className="text-primary-600 dark:text-primary-400 font-bold">
                            {phaseStats.avgIntensity.toFixed(1)}/10
                          </Text>
                        </View>

                        <View className="items-center">
                          <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                            Clarté moy.
                          </Text>
                          <Text className="text-primary-600 dark:text-primary-400 font-bold">
                            {phaseStats.avgClarity.toFixed(1)}/10
                          </Text>
                        </View>

                        {phaseStats.lucidCount > 0 && (
                          <View className="items-center">
                            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                              Lucides
                            </Text>
                            <Text className="text-purple-600 dark:text-purple-400 font-bold">
                              {phaseStats.lucidCount}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text className="text-gray-600 dark:text-gray-400 text-sm italic text-center">
                        {getMoonPhaseDescription(phase)}
                      </Text>
                    </View>
                  </View>
                );
              })
          )}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

