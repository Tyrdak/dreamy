// En-tête du profil avec avatar
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  username: string;
  avatar: string;
  personalizedMessage: string;
  onEditName: () => void;
  onEditAvatar: () => void;
  onNavigateSettings: () => void;
  onBack: () => void;
  topInset: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  avatar,
  personalizedMessage,
  onEditName,
  onEditAvatar,
  onNavigateSettings,
  onBack,
  topInset,
}) => {
  const isImageAvatar = avatar && (avatar.startsWith('file://') || avatar.startsWith('http'));

  return (
    <View style={{ paddingTop: topInset + 12, backgroundColor: '#312e81' }} className="pb-6 px-6">
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onBack(); }}>
          <Ionicons name="arrow-back" size={24} color="#fef08a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>Mon Profil</Text>
        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onNavigateSettings(); }}>
          <Ionicons name="settings-outline" size={24} color="#fef08a" />
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <TouchableOpacity onPress={onEditAvatar} activeOpacity={0.8}>
          <View className="w-32 h-32 rounded-full items-center justify-center bg-white/10 mb-4">
            {isImageAvatar ? (
              <Image source={{ uri: avatar }} className="w-full h-full rounded-full" />
            ) : (
              <Text className="text-6xl">{avatar || '😴'}</Text>
            )}
            <View className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2">
              <Ionicons name="camera" size={20} color="#312e81" />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onEditName} className="flex-row items-center mb-2">
          <Text className="text-2xl font-bold mr-2" style={{ color: '#fef08a' }}>{username}</Text>
          <Ionicons name="create-outline" size={20} color="#fef08a" />
        </TouchableOpacity>

        <Text style={{ color: '#a78bfa' }} className="text-sm">{personalizedMessage}</Text>
      </View>
    </View>
  );
};

