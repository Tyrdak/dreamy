// Écran de tutoriel / Onboarding

import React, { useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components';
import { saveUserProfile, setOnboardingCompleted } from '../storage';
import { UserProfile } from '../types';

interface OnboardingTutorialScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const tutorialPages = [
  {
    emoji: '💭',
    title: 'Pourquoi noter ses rêves ?',
    description: 'Les rêves sont une fenêtre sur votre inconscient. En les notant régulièrement, vous développez votre mémoire onirique et découvrez des patterns fascinants.',
    color: '#7c6df1',
  },
  {
    emoji: '🌙',
    title: 'Le pouvoir de la Lune',
    description: 'La lune influence nos rêves depuis la nuit des temps. Chaque phase lunaire apporte une énergie différente à vos expériences nocturnes.',
    color: '#6d28d9',
  },
  {
    emoji: '✍️',
    title: 'Comment utiliser Dreamy',
    description: 'Chaque matin, prenez quelques minutes pour enregistrer vos rêves. Plus vous serez détaillé, plus vos analyses seront riches et pertinentes.',
    color: '#5e39ca',
  },
  {
    emoji: '📈',
    title: 'Suivez votre évolution',
    description: 'Découvrez des statistiques sur vos rêves, identifiez les émotions récurrentes, et comprenez mieux votre monde intérieur.',
    color: '#4e31a3',
  },
];

export const OnboardingTutorialScreen: React.FC<OnboardingTutorialScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const [showNameInput, setShowNameInput] = useState(false);
  const [username, setUsername] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < tutorialPages.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
    } else {
      // Afficher l'écran de saisie du nom
      setShowNameInput(true);
    }
  };

  const handleSkip = () => {
    setShowNameInput(true);
  };

  const handleFinish = async () => {
    const finalUsername = username.trim() || 'Rêveur';
    
    // Marquer l'onboarding comme terminé
    await setOnboardingCompleted(true);
    
    // Créer un profil utilisateur avec le nom saisi
    const defaultProfile: UserProfile = {
      id: `user_${Date.now()}`,
      username: finalUsername,
      avatar: '😴',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    };
    
    await saveUserProfile(defaultProfile);
    
    // Naviguer vers l'application principale
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  if (showNameInput) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-dream-night"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <Text className="text-6xl mb-6">👋</Text>
            <Text className="text-white text-3xl font-bold text-center mb-3">
              Et vous, c'est quoi votre prénom ?
            </Text>
            <Text className="text-white/70 text-base text-center leading-6">
              On aimerait mieux vous connaître pour personnaliser votre expérience
            </Text>
          </View>

          <View className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <TextInput
              className="bg-white/20 text-white text-xl text-center rounded-xl px-6 py-4"
              placeholder="Votre prénom..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={username}
              onChangeText={setUsername}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleFinish}
            />
          </View>

          <Button
            title={username.trim() ? "Commencer mon journal" : "Commencer"}
            onPress={handleFinish}
            variant="primary"
            fullWidth
            className="bg-dream-moon"
          />

          <Text className="text-white/50 text-xs text-center mt-4">
            Vous pourrez toujours modifier ceci plus tard dans les paramètres
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View className="flex-1 bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row justify-between items-center px-6 pb-6"
      >
        <Text className="text-white/60 text-sm">
          {currentPage + 1} / {tutorialPages.length}
        </Text>
        <Button
          title="Passer"
          onPress={handleSkip}
          variant="ghost"
          size="sm"
          className="bg-transparent"
        />
      </View>

      {/* Tutorial Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {tutorialPages.map((page, index) => (
          <View
            key={index}
            style={{ width }}
            className="flex-1 items-center px-8 pt-16"
          >
            <View className="flex-1 justify-center items-center">
              <Text className="text-8xl mb-8">{page.emoji}</Text>
              
              <Text className="text-white text-3xl font-bold text-center mb-6">
                {page.title}
              </Text>
              
              <Text className="text-white/80 text-lg text-center leading-7 px-4">
                {page.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View className="flex-row justify-center items-center mb-8 mt-4">
        {tutorialPages.map((_, index) => (
          <View
            key={index}
            className={`
              h-2 rounded-full mx-1
              ${index === currentPage ? 'w-8 bg-dream-moon' : 'w-2 bg-white/30'}
            `.trim()}
          />
        ))}
      </View>

      {/* Navigation Button */}
      <View 
        style={{ paddingBottom: insets.bottom + 24 }}
        className="px-6"
      >
        <Button
          title={currentPage === tutorialPages.length - 1 ? "Continuer" : "Suivant"}
          onPress={handleNext}
          variant="primary"
          fullWidth
          className="bg-dream-moon"
        />
      </View>
    </View>
  );
};

