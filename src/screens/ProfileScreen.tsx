// Écran de profil utilisateur avec statistiques
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarPickerModal, EditNameModal, ProfileHeader, StatsGrid } from '../components/profile';
import { getDreams, getDreamStreak, getUserBadges, getUserProfile, updateUserProfile } from '../storage';
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
  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const emojiAvatars = ['😴', '🌙', '✨', '🌟', '💫', '⭐', '🌌', '🌠', '🦋', '🎨', '🎭', '🎪', '🎯', '🎸', '🚀', '🌈'];

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

  const handleChangeName = async () => {
    if (!editedName.trim()) {
      Alert.alert('Erreur', 'Le nom ne peut pas être vide');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateUserProfile({ username: editedName.trim() });
    setProfile({ ...profile!, username: editedName.trim() });
    setShowEditName(false);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder aux photos');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled && result.assets[0]) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await updateUserProfile({ avatar: result.assets[0].uri });
        setProfile({ ...profile!, avatar: result.assets[0].uri });
        setShowAvatarPicker(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const handlePickEmoji = async (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateUserProfile({ avatar: emoji });
    setProfile({ ...profile!, avatar: emoji });
    setShowAvatarPicker(false);
  };

  const getPersonalizedMessage = () => {
    if (!stats) return '';
    if (stats.totalDreams === 0) return "Commencez votre voyage onirique ! 🌙";
    if (stats.totalDreams < 5) return "Vous débutez votre exploration 🌱";
    if (stats.totalDreams < 20) return "Vous êtes sur la bonne voie ! ⭐";
    if (stats.totalDreams < 50) return "Rêveur passionné 🌟";
    if (stats.totalDreams < 100) return "Expert des rêves ! 💫";
    return "Maître onirique 🏆";
  };

  if (loading || !profile || !stats) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#312e81' }}>
        <Text className="text-lg" style={{ color: '#fef08a' }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <ProfileHeader
        username={profile.username}
        avatar={profile.avatar || ''}
        personalizedMessage={getPersonalizedMessage()}
        onEditName={() => { setEditedName(profile.username); setShowEditName(true); }}
        onEditAvatar={() => setShowAvatarPicker(true)}
        onNavigateSettings={() => navigation.navigate('Settings')}
        onBack={() => navigation.goBack()}
        topInset={insets.top}
      />

      <ScrollView className="flex-1">
        <StatsGrid
          totalDreams={stats.totalDreams}
          currentStreak={streak?.currentStreak || 0}
          longestStreak={streak?.longestStreak || 0}
          badgesCount={badges?.badges.length || 0}
        />

        {stats.mostCommonTags.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
              Mots-clés favoris
            </Text>
            <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 flex-row flex-wrap">
              {stats.mostCommonTags.map((tag) => (
                <View key={tag} className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1 m-1">
                  <Text className="text-primary-700 dark:text-primary-300 text-sm">#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>

      <EditNameModal
        visible={showEditName}
        value={editedName}
        onChangeText={setEditedName}
        onSave={handleChangeName}
        onCancel={() => setShowEditName(false)}
      />

      <AvatarPickerModal
        visible={showAvatarPicker}
        emojiAvatars={emojiAvatars}
        onPickEmoji={handlePickEmoji}
        onPickImage={handlePickImage}
        onCancel={() => setShowAvatarPicker(false)}
      />
    </View>
  );
};
