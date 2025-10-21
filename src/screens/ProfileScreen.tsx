// Écran de profil utilisateur avec statistiques

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  
  // États pour l'édition
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
      console.error('Erreur lors de la sélection de l\'image:', error);
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
    
    if (stats.totalDreams === 0) {
      return "Commencez votre voyage onirique ! 🌙";
    } else if (stats.totalDreams < 5) {
      return "Vous débutez votre exploration 🌱";
    } else if (stats.totalDreams < 20) {
      return "Vous êtes sur la bonne voie ! ⭐";
    } else if (stats.totalDreams < 50) {
      return "Rêveur passionné 🌟";
    } else if (stats.totalDreams < 100) {
      return "Expert des rêves ! 💫";
    } else {
      return "Maître onirique 🏆";
    }
  };

  if (loading || !profile || !stats) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#312e81' }}>
        <Text className="text-lg" style={{ color: '#fef08a' }}>Chargement...</Text>
      </View>
    );
  }

  const isImageAvatar = profile.avatar && (profile.avatar.startsWith('file://') || profile.avatar.startsWith('http'));

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12, backgroundColor: '#312e81' }}
        className="pb-4 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fef08a" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
            Mon Profil
          </Text>
          
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Settings');
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#fef08a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Carte de profil */}
        <View className="bg-white dark:bg-dream-dusk mx-6 mt-6 rounded-3xl p-6 shadow-lg">
          {/* Avatar */}
          <View className="items-center mb-4">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowAvatarPicker(true);
              }}
              className="relative"
            >
              <View
                className="rounded-full w-28 h-28 items-center justify-center shadow-lg"
                style={{ backgroundColor: '#a78bfa20', borderWidth: 3, borderColor: '#fef08a' }}
              >
                {isImageAvatar ? (
                  <Image 
                    source={{ uri: profile.avatar }} 
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-7xl">{profile.avatar || '😴'}</Text>
                )}
              </View>
              
              {/* Bouton edit */}
              <View 
                className="absolute bottom-0 right-0 rounded-full w-9 h-9 items-center justify-center shadow-md"
                style={{ backgroundColor: '#312e81' }}
              >
                <Ionicons name="camera" size={18} color="#fef08a" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Nom */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setEditedName(profile.username);
              setShowEditName(true);
            }}
            className="items-center mb-2"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mr-2">
                {profile.username}
              </Text>
              <Ionicons name="pencil" size={18} color="#a78bfa" />
            </View>
          </TouchableOpacity>

          {/* Message personnalisé */}
          <Text className="text-center mb-2" style={{ color: '#a78bfa', fontSize: 15 }}>
            {getPersonalizedMessage()}
          </Text>

          {/* Date de création */}
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center">
            Rêveur depuis le {new Date(profile.createdAt).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>

        {/* Streak */}
        {streak && streak.currentStreak > 0 && (
          <View className="px-6 mt-5">
            <View 
              className="rounded-3xl p-5 shadow-lg"
              style={{ backgroundColor: '#312e81' }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-5xl mr-4">🔥</Text>
                  <View>
                    <Text className="text-3xl font-bold" style={{ color: '#fef08a' }}>
                      {streak.currentStreak}
                    </Text>
                    <Text className="text-sm" style={{ color: '#a78bfa' }}>
                      jours d'affilée !
                    </Text>
                  </View>
                </View>
                {streak.longestStreak > streak.currentStreak && (
                  <View className="items-end">
                    <Text className="text-xs" style={{ color: '#a78bfa80' }}>Record</Text>
                    <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
                      {streak.longestStreak} 🏆
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Stats rapides */}
        <View className="px-6 mt-5">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-3">
            📊 Vos statistiques
          </Text>
          
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold mb-1 text-dream-night dark:text-dream-cloud">
                {stats.totalDreams}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                Rêves notés
              </Text>
            </View>
            
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold mb-1 text-dream-night dark:text-dream-cloud">
                {stats.averageClarity.toFixed(1)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                Clarté /10
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold mb-1 text-dream-night dark:text-dream-cloud">
                {stats.averageIntensity.toFixed(1)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                Intensité /10
              </Text>
            </View>
            
            <View className="flex-1 bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm">
              <Text className="text-3xl font-bold mb-1 text-dream-night dark:text-dream-cloud">
                {Object.keys(stats.dreamsByMoonPhase).length}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-xs">
                Phases 🌙
              </Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        {badges && badges.totalUnlocked > 0 && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Badges');
            }}
            className="px-6 mt-5"
          >
            <View 
              className="rounded-3xl p-5 shadow-lg"
              style={{ backgroundColor: '#fef08a20', borderWidth: 2, borderColor: '#fef08a' }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-4xl mr-3">🏆</Text>
                  <View>
                    <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
                      {badges.totalUnlocked} Badges
                    </Text>
                    <Text className="text-sm" style={{ color: '#a78bfa' }}>
                      Découvrez vos trophées
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#a78bfa" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Tags populaires */}
        {stats.mostCommonTags.length > 0 && (
          <View className="px-6 mt-5">
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-3">
              🏷️ Vos thèmes favoris
            </Text>
            
            <View className="bg-white dark:bg-dream-dusk rounded-3xl p-4 shadow-sm">
              <View className="flex-row flex-wrap gap-2">
                {stats.mostCommonTags.slice(0, 8).map((tag, index) => (
                  <View
                    key={index}
                    className="rounded-full px-3 py-2"
                    style={{ backgroundColor: '#a78bfa20', borderWidth: 1, borderColor: '#a78bfa' }}
                  >
                    <Text className="text-dream-night dark:text-dream-cloud font-medium">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Actions rapides */}
        <View className="px-6 mt-5 mb-8">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-3">
            ⚡ Actions rapides
          </Text>

          <View className="gap-3">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Constellation');
              }}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">⭐</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Ma constellation
                  </Text>
                  <Text style={{ color: '#a78bfa' }} className="text-xs">
                    Visualiser mes rêves en étoiles
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Rituals');
              }}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">🧘</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Rituels & Zen
                  </Text>
                  <Text style={{ color: '#a78bfa' }} className="text-xs">
                    Exercices de relaxation
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Calendar');
              }}
              className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-3">📅</Text>
                <View>
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Calendrier
                  </Text>
                  <Text style={{ color: '#a78bfa' }} className="text-xs">
                    Explorer par dates
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Modal changement de nom */}
      <Modal
        visible={showEditName}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditName(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-4 text-center">
              Changez votre nom
            </Text>
            
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Votre nom..."
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 mb-5 text-base text-dream-night dark:text-dream-cloud"
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowEditName(false);
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-2xl py-3"
              >
                <Text className="text-center font-semibold text-gray-700 dark:text-gray-300">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangeName}
                className="flex-1 rounded-2xl py-3"
                style={{ backgroundColor: '#312e81' }}
              >
                <Text className="text-center font-bold" style={{ color: '#fef08a' }}>
                  Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal choix avatar */}
      <Modal
        visible={showAvatarPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-dream-dusk rounded-t-3xl p-6" style={{ maxHeight: '70%' }}>
            <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-4 text-center">
              Choisissez votre avatar
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Option photo */}
              <TouchableOpacity
                onPress={handlePickImage}
                className="rounded-2xl p-4 mb-4 flex-row items-center"
                style={{ backgroundColor: '#fef08a20', borderWidth: 2, borderColor: '#fef08a' }}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: '#312e81' }}
                >
                  <Ionicons name="image" size={24} color="#fef08a" />
                </View>
                <Text className="font-semibold text-dream-night dark:text-dream-cloud">
                  Choisir une photo
                </Text>
              </TouchableOpacity>

              {/* Émojis */}
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Ou choisissez un emoji :
              </Text>
              <View className="flex-row flex-wrap gap-3 mb-4">
                {emojiAvatars.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePickEmoji(emoji)}
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ 
                      backgroundColor: profile.avatar === emoji ? '#a78bfa20' : '#f3f4f6',
                      borderWidth: profile.avatar === emoji ? 2 : 0,
                      borderColor: '#a78bfa'
                    }}
                  >
                    <Text className="text-3xl">{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAvatarPicker(false);
              }}
              className="bg-gray-200 dark:bg-gray-700 rounded-2xl py-3 mt-2"
            >
              <Text className="text-center font-semibold text-gray-700 dark:text-gray-300">
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
