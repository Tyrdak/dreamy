// Écran des badges et récompenses
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeCard, ProgressCard } from '../components/badges';
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

  const unlockedBadges = userBadges.badges.filter((b) => b.isUnlocked);
  const lockedBadges = userBadges.badges.filter((b) => !b.isUnlocked);

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
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
        <ProgressCard totalUnlocked={userBadges.totalUnlocked} totalBadges={userBadges.badges.length} />

        {unlockedBadges.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🏆 Vos trophées
            </Text>
            <View className="flex-row flex-wrap">
              {unlockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </View>
          </View>
        )}

        {lockedBadges.length > 0 && (
          <View className="px-6 mt-6 mb-8">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
              🔒 À débloquer
            </Text>
            <View className="flex-row flex-wrap">
              {lockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} isLocked />
              ))}
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
