// Écran des badges et récompenses

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserBadges } from '../storage';
import { UserBadges } from '../types';

interface BadgesScreenProps {
  navigation: any;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userBadges, setUserBadges] = useState<UserBadges | null>(null);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const badges = await getUserBadges();
    setUserBadges(badges);
  };

  if (!userBadges) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-primary-600 text-lg">Chargement...</Text>
      </View>
    );
  }

  const unlockedBadges = userBadges.badges.filter(b => b.isUnlocked);
  const lockedBadges = userBadges.badges.filter(b => !b.isUnlocked);

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
            Badges & Récompenses
          </Text>

          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Progression */}
        <View className="px-6 mt-6">
          <View className="bg-primary-600 rounded-2xl p-6 shadow-lg">
            <Text className="text-white text-center text-base mb-3">
              Badges débloqués
            </Text>
            <Text className="text-white text-6xl font-bold text-center mb-2">
              {userBadges.totalUnlocked}/{userBadges.badges.length}
            </Text>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden mt-2">
              <View
                className="h-full bg-dream-moon rounded-full"
                style={{
                  width: `${(userBadges.totalUnlocked / userBadges.badges.length) * 100}%`,
                }}
              />
            </View>
          </View>
        </View>

        {/* Badges débloqués */}
        {unlockedBadges.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🏆 Vos trophées
            </Text>

            <View className="flex-row flex-wrap">
              {unlockedBadges.map((badge) => (
                <View
                  key={badge.id}
                  className="w-1/2 p-2"
                >
                  <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg border-2 border-primary-300 dark:border-primary-700">
                    <Text className="text-5xl text-center mb-2">{badge.emoji}</Text>
                    <Text className="text-dream-night dark:text-dream-cloud font-bold text-center mb-1">
                      {badge.name}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-xs text-center">
                      {badge.description}
                    </Text>
                    {badge.unlockedAt && (
                      <Text className="text-primary-600 dark:text-primary-400 text-xs text-center mt-2">
                        ✓ Débloqué
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Badges à débloquer */}
        {lockedBadges.length > 0 && (
          <View className="px-6 mt-6 mb-8">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🔒 À débloquer
            </Text>

            <View className="flex-row flex-wrap">
              {lockedBadges.map((badge) => (
                <View
                  key={badge.id}
                  className="w-1/2 p-2"
                >
                  <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow opacity-60">
                    <Text className="text-5xl text-center mb-2 opacity-40">{badge.emoji}</Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-bold text-center mb-1">
                      {badge.name}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-500 text-xs text-center">
                      {badge.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

