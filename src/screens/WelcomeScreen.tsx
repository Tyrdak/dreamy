// Écran d'accueil / Welcome

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20 pb-10">
        {/* Logo / Icône */}
        <View className="items-center mb-8">
          <Text className="text-8xl mb-4">🌙</Text>
          <Text className="text-4xl font-bold text-dream-night text-center mb-2">
            Dreamy
          </Text>
          <Text className="text-xl text-primary-600 text-center">
            Votre journal de rêves personnel
          </Text>
        </View>

        {/* Description */}
        <View className="bg-primary-50 rounded-3xl p-6 mb-8 border border-primary-200">
          <Text className="text-dream-night text-lg leading-7 text-center">
            Explorez l'univers fascinant de vos rêves. 
            Notez, analysez et découvrez les mystères de votre inconscient.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-10">
          <View className="flex-row items-center bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-5">
            <Text className="text-4xl mr-4">📝</Text>
            <View className="flex-1">
              <Text className="text-dream-night font-semibold text-lg mb-1">
                Enregistrez vos rêves
              </Text>
              <Text className="text-gray-600 text-sm">
                Capturez chaque détail de vos expériences nocturnes
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-5">
            <Text className="text-4xl mr-4">🌕</Text>
            <View className="flex-1">
              <Text className="text-dream-night font-semibold text-lg mb-1">
                Suivez les phases lunaires
              </Text>
              <Text className="text-gray-600 text-sm">
                Découvrez le lien entre vos rêves et la lune
              </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <Text className="text-4xl mr-4">📊</Text>
            <View className="flex-1">
              <Text className="text-dream-night font-semibold text-lg mb-1">
                Analysez vos patterns
              </Text>
              <Text className="text-gray-600 text-sm">
                Identifiez les thèmes récurrents et les émotions
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          title="Commencer l'aventure"
          onPress={() => navigation.navigate('OnboardingTutorial')}
          variant="primary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

