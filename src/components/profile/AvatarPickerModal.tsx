// Modal de sélection d'avatar
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface AvatarPickerModalProps {
  visible: boolean;
  emojiAvatars: string[];
  onPickEmoji: (emoji: string) => void;
  onPickImage: () => void;
  onCancel: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  emojiAvatars,
  onPickEmoji,
  onPickImage,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-dream-dusk rounded-t-3xl max-h-[70%]">
          <View className="p-6 border-b border-gray-200 dark:border-dream-purple">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
                Choisir un avatar
              </Text>
              <TouchableOpacity onPress={onCancel}>
                <Ionicons name="close-circle" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="p-6">
            <TouchableOpacity
              onPress={onPickImage}
              className="bg-primary-100 dark:bg-primary-900 rounded-2xl p-4 mb-4 flex-row items-center justify-center"
            >
              <Ionicons name="image" size={24} color="#7c6df1" />
              <Text className="text-primary-600 font-semibold ml-2">
                Choisir une photo
              </Text>
            </TouchableOpacity>

            <Text className="text-gray-600 dark:text-gray-400 mb-3">Ou choisir un emoji</Text>
            <View className="flex-row flex-wrap">
              {emojiAvatars.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onPickEmoji(emoji)}
                  className="w-16 h-16 items-center justify-center m-1 bg-gray-100 dark:bg-gray-800 rounded-2xl"
                >
                  <Text className="text-3xl">{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

