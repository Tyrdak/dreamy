// Écran d'ajout de rêve avec formulaire complet
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components';
import { BasicInfoSection, DetailsSection, EmotionsSection, FormHeader } from '../components/add-dream';
import { fetchMoonPhase } from '../services';
import { getAllUsedTags, saveDream } from '../storage';
import { Dream, DreamType, EmotionalState, SleepQuality, Tone } from '../types';
import { generateDreamId } from '../utils';

interface AddDreamScreenProps {
  navigation: any;
}

export const AddDreamScreen: React.FC<AddDreamScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    date: today,
    time: now,
    type: 'ordinaire' as DreamType,
    title: '',
    description: '',
    emotionalStateBefore: 'neutre' as EmotionalState,
    emotionalStateAfter: 'neutre' as EmotionalState,
    emotionalIntensity: 5,
    characters: [] as string[],
    location: '',
    clarity: 5,
    tags: [] as string[],
    sleepQuality: 'moyen' as SleepQuality,
    personalMeaning: '',
    tone: 'neutre' as Tone,
  });

  const dreamTypeOptions = [
    { label: 'Cauchemar', value: 'cauchemar', icon: '😱' },
    { label: 'Lucide', value: 'lucide', icon: '✨' },
    { label: 'Ordinaire', value: 'ordinaire', icon: '💭' },
    { label: 'Récurrent', value: 'récurrent', icon: '🔄' },
    { label: 'Prémonitoire', value: 'prémonitoire', icon: '🔮' },
  ];

  const emotionalStateOptions = [
    { label: 'Joyeux', value: 'joyeux', icon: '😊' },
    { label: 'Calme', value: 'calme', icon: '😌' },
    { label: 'Anxieux', value: 'anxieux', icon: '😰' },
    { label: 'Triste', value: 'triste', icon: '😢' },
    { label: 'Excité', value: 'excité', icon: '🤩' },
    { label: 'Confus', value: 'confus', icon: '😕' },
    { label: 'Neutre', value: 'neutre', icon: '😐' },
  ];

  const sleepQualityOptions = [
    { label: 'Excellent', value: 'excellent' },
    { label: 'Bon', value: 'bon' },
    { label: 'Moyen', value: 'moyen' },
    { label: 'Mauvais', value: 'mauvais' },
    { label: 'Très mauvais', value: 'très mauvais' },
  ];

  const toneOptions = [
    { label: 'Positive', value: 'positive', icon: '✅' },
    { label: 'Neutre', value: 'neutre', icon: '➖' },
    { label: 'Négative', value: 'négative', icon: '❌' },
  ];

  useEffect(() => {
    getAllUsedTags().then(setAvailableTags);
  }, []);

  const progress = useMemo(() => {
    let count = 0;
    if (formData.description.trim()) count++;
    if (formData.title.trim()) count++;
    if (formData.location.trim()) count++;
    if (formData.characters.length > 0) count++;
    if (formData.tags.length > 0) count++;
    if (formData.personalMeaning.trim()) count++;
    return Math.round((count / 6) * 100);
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData.description.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Veuillez décrire votre rêve');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const moonPhaseData = await fetchMoonPhase(formData.date);
      const newDream: Dream = {
        id: generateDreamId(),
        ...formData,
        moonPhase: moonPhaseData.phaseName as any,
        moonPhaseEmoji: moonPhaseData.emoji,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await saveDream(newDream);

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        let message = 'Votre rêve a été enregistré !';
        if (result.streak && result.streak.currentStreak > 1) {
          message += `\n\n🔥 Série de ${result.streak.currentStreak} jours !`;
        }
        if (result.newBadges && result.newBadges.length > 0) {
          message += '\n\n🏆 Nouveau badge débloqué !';
        }
        Alert.alert('✨ Félicitations', message, [{ text: 'Super !', onPress: () => navigation.goBack() }]);
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le rêve. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <FormHeader progress={progress} onClose={() => navigation.goBack()} topInset={insets.top} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <BasicInfoSection
          title={formData.title}
          description={formData.description}
          date={formData.date}
          type={formData.type}
          showDatePicker={showDatePicker}
          dreamTypeOptions={dreamTypeOptions}
          onTitleChange={(title) => setFormData({ ...formData, title })}
          onDescriptionChange={(description) => setFormData({ ...formData, description })}
          onDateChange={(date) => setFormData({ ...formData, date })}
          onTypeChange={(type) => setFormData({ ...formData, type })}
          onToggleDatePicker={setShowDatePicker}
        />

        <EmotionsSection
          emotionalStateBefore={formData.emotionalStateBefore}
          emotionalStateAfter={formData.emotionalStateAfter}
          emotionalIntensity={formData.emotionalIntensity}
          emotionalStateOptions={emotionalStateOptions}
          onEmotionalStateBeforeChange={(state) => setFormData({ ...formData, emotionalStateBefore: state })}
          onEmotionalStateAfterChange={(state) => setFormData({ ...formData, emotionalStateAfter: state })}
          onEmotionalIntensityChange={(intensity) => setFormData({ ...formData, emotionalIntensity: intensity })}
        />

        <DetailsSection
          clarity={formData.clarity}
          location={formData.location}
          characters={formData.characters}
          tags={formData.tags}
          sleepQuality={formData.sleepQuality}
          personalMeaning={formData.personalMeaning}
          tone={formData.tone}
          sleepQualityOptions={sleepQualityOptions}
          toneOptions={toneOptions}
          onClarityChange={(clarity) => setFormData({ ...formData, clarity })}
          onLocationChange={(location) => setFormData({ ...formData, location })}
          onCharactersChange={(characters) => setFormData({ ...formData, characters })}
          onTagsChange={(tags) => setFormData({ ...formData, tags })}
          onSleepQualityChange={(quality) => setFormData({ ...formData, sleepQuality: quality })}
          onPersonalMeaningChange={(meaning) => setFormData({ ...formData, personalMeaning: meaning })}
          onToneChange={(tone) => setFormData({ ...formData, tone })}
        />

        <View className="px-4 mt-6 mb-8">
          <Button
            title={loading ? "Enregistrement..." : "✨ Enregistrer mon rêve"}
            onPress={handleSubmit}
            variant="primary"
            fullWidth
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};
