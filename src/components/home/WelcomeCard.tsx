// Carte de bienvenue pour premier rêve
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WelcomeCardProps {
  onAddDream: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onAddDream }) => {
  return (
    <View className="bg-white dark:bg-dream-dusk rounded-3xl p-6 shadow-lg border-2 border-primary-300 dark:border-primary-700">
      <View className="items-center mb-4">
        <Text className="text-6xl mb-3">🌟</Text>
        <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud text-center mb-2">
          Bienvenue dans votre journal de rêves !
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-5">
          Vous n'avez pas encore enregistré de rêve.{'\n'}
          Commencez votre aventure onirique maintenant !
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={onAddDream}
        className="bg-primary-600 rounded-2xl py-4 px-6 shadow-md active:bg-primary-700"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Enregistrer mon premier rêve
          </Text>
        </View>
      </TouchableOpacity>
      
      <View className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-3">
        <Text className="text-primary-700 dark:text-primary-300 text-xs text-center">
          💡 Conseil : Notez vos rêves dès le réveil, quand ils sont encore frais dans votre mémoire !
        </Text>
      </View>
    </View>
  );
};

