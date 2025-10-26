// Modal d'édition du nom
import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditNameModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditNameModal: React.FC<EditNameModalProps> = ({
  visible,
  value,
  onChangeText,
  onSave,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white dark:bg-dream-dusk rounded-3xl p-6 w-full">
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud mb-4">
            Modifier le nom
          </Text>
          <TextInput
            className="bg-gray-100 dark:bg-dream-night rounded-2xl px-4 py-3 text-dream-night dark:text-dream-cloud mb-4"
            placeholder="Votre nom"
            value={value}
            onChangeText={onChangeText}
            autoFocus
          />
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={onCancel} className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-2xl py-3">
              <Text className="text-gray-800 dark:text-gray-200 text-center font-semibold">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} className="flex-1 bg-primary-600 rounded-2xl py-3">
              <Text className="text-white text-center font-semibold">Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

