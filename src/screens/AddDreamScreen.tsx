// Écran d'ajout de rêve avec formulaire complet

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input, Picker, Slider, TagInput } from '../components';
import { fetchMoonPhase } from '../services';
import { saveDream } from '../storage';
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

  // Calcul de la progression (seulement champs optionnels/remplis)
  const progress = useMemo(() => {
    let count = 0;
    let total = 6;
    
    // Champs obligatoires/importants
    if (formData.description.trim()) count++;
    if (formData.title.trim()) count++;
    if (formData.location.trim()) count++;
    if (formData.characters.length > 0) count++;
    if (formData.tags.length > 0) count++;
    if (formData.personalMeaning.trim()) count++;
    
    return Math.round((count / total) * 100);
  }, [formData]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.description.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Veuillez décrire votre rêve');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      // Récupère la phase lunaire
      const moonPhaseData = await fetchMoonPhase(formData.date);

      // Crée le rêve
      const newDream: Dream = {
        id: generateDreamId(),
        date: formData.date,
        time: formData.time,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        emotionalStateBefore: formData.emotionalStateBefore,
        emotionalStateAfter: formData.emotionalStateAfter,
        emotionalIntensity: formData.emotionalIntensity,
        characters: formData.characters,
        location: formData.location,
        clarity: formData.clarity,
        tags: formData.tags,
        sleepQuality: formData.sleepQuality,
        personalMeaning: formData.personalMeaning,
        tone: formData.tone,
        moonPhase: moonPhaseData.phaseName as any,
        moonPhaseEmoji: moonPhaseData.emoji,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Sauvegarde
      const result = await saveDream(newDream);

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Message de succès avec streak
        let message = 'Votre rêve a été enregistré !';
        
        if (result.streak && result.streak.currentStreak > 1) {
          message += `\n\n🔥 Série de ${result.streak.currentStreak} jours !`;
        }
        
        if (result.newBadges && result.newBadges.length > 0) {
          message += '\n\n🏆 Nouveau badge débloqué !';
        }

        Alert.alert('✨ Félicitations', message, [
          {
            text: 'Super !',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le rêve. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader: React.FC<{ title: string; subtitle?: string; icon: string }> = ({ title, subtitle, icon }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Text className="text-2xl mr-2">{icon}</Text>
        <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
          {title}
        </Text>
      </View>
      {subtitle && (
        <Text className="text-gray-500 dark:text-gray-400 text-sm ml-9">
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-5 px-6"
      >
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center"
          >
            <Ionicons name="close" size={20} color="#7c6df1" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
              Nouveau Rêve
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Notez vos rêves pour mieux les comprendre
            </Text>
          </View>
          
          <View style={{ width: 40 }} />
        </View>

        {/* Progress bar */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-600 dark:text-gray-400 text-xs">
              Progression
            </Text>
            <Text className="text-primary-600 font-bold text-xs">
              {progress}%
            </Text>
          </View>
          <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <View 
              className="bg-primary-600 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      {/* Form */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Section 1: Informations de base */}
        <View className="bg-white dark:bg-dream-dusk mx-4 mt-5 rounded-3xl p-5 shadow-sm">
          <SectionHeader 
            icon="✍️" 
            title="Racontez votre rêve" 
            subtitle="Les détails essentiels"
          />

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date du rêve
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDatePicker(true);
              }}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-gray-900 dark:text-gray-100 text-base">
                {new Date(formData.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#7c6df1" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    setFormData({ ...formData, date: dateStr });
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <Picker
            label="Type de rêve"
            value={formData.type}
            options={dreamTypeOptions}
            onValueChange={(type) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, type: type as DreamType });
            }}
          />

          <Input
            label="Titre (optionnel)"
            value={formData.title}
            onChangeText={(title) => setFormData({ ...formData, title })}
            placeholder="Un titre pour vous en souvenir..."
          />

          <Input
            label="Description *"
            value={formData.description}
            onChangeText={(description) => setFormData({ ...formData, description })}
            placeholder="Racontez votre rêve en détail... Qu'avez-vous vu, ressenti, vécu ?"
            multiline
            rows={6}
          />
        </View>

        {/* Section 2: Émotions */}
        <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
          <SectionHeader 
            icon="💭" 
            title="Vos émotions" 
            subtitle="Avant, pendant et après"
          />

          <Picker
            label="Avant le sommeil"
            value={formData.emotionalStateBefore}
            options={emotionalStateOptions}
            onValueChange={(state) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, emotionalStateBefore: state as EmotionalState });
            }}
          />

          <Picker
            label="Au réveil"
            value={formData.emotionalStateAfter}
            options={emotionalStateOptions}
            onValueChange={(state) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, emotionalStateAfter: state as EmotionalState });
            }}
          />

          <Slider
            label="Intensité émotionnelle"
            value={formData.emotionalIntensity}
            onValueChange={(intensity) => setFormData({ ...formData, emotionalIntensity: intensity })}
            minimumValue={1}
            maximumValue={10}
            step={1}
            leftLabel="Faible"
            rightLabel="Intense"
          />
        </View>

        {/* Section 3: Détails du rêve */}
        <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
          <SectionHeader 
            icon="🌟" 
            title="Détails & Contexte" 
            subtitle="Enrichissez votre souvenir"
          />

          <Slider
            label="Clarté du rêve"
            value={formData.clarity}
            onValueChange={(clarity) => setFormData({ ...formData, clarity })}
            minimumValue={1}
            maximumValue={10}
            step={1}
            leftLabel="Flou"
            rightLabel="Net"
          />

          <Input
            label="Lieu du rêve"
            value={formData.location}
            onChangeText={(location) => setFormData({ ...formData, location })}
            placeholder="Ex: Une forêt enchantée, ma maison d'enfance..."
          />

          <TagInput
            label="Personnages présents"
            tags={formData.characters}
            onAddTag={(character) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, characters: [...formData.characters, character] });
            }}
            onRemoveTag={(character) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, characters: formData.characters.filter(c => c !== character) });
            }}
            placeholder="Ajouter un personnage..."
          />

          <TagInput
            label="Mots-clés"
            tags={formData.tags}
            onAddTag={(tag) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, tags: [...formData.tags, tag] });
            }}
            onRemoveTag={(tag) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
            }}
            placeholder="Ex: vol, eau, voyage..."
          />
        </View>

        {/* Section 4: Analyse */}
        <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">

          <SectionHeader 
            icon="🔍" 
            title="Analyse" 
            subtitle="Pour mieux comprendre"
          />

          <Picker
            label="Qualité du sommeil"
            value={formData.sleepQuality}
            options={sleepQualityOptions}
            onValueChange={(quality) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, sleepQuality: quality as SleepQuality });
            }}
          />

          <Picker
            label="Tonalité globale"
            value={formData.tone}
            options={toneOptions}
            onValueChange={(tone) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFormData({ ...formData, tone: tone as Tone });
            }}
          />

          <Input
            label="Signification personnelle"
            value={formData.personalMeaning}
            onChangeText={(meaning) => setFormData({ ...formData, personalMeaning: meaning })}
            placeholder="Que représente ce rêve pour vous ? Quelle interprétation lui donnez-vous ?"
            multiline
            rows={4}
          />
        </View>

        {/* Submit Button */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !formData.description.trim()}
            className={`
              rounded-full py-4 shadow-lg
              ${loading || !formData.description.trim() 
                ? 'bg-gray-300 dark:bg-gray-700' 
                : 'bg-primary-600'}
            `.trim()}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              {loading ? (
                <Text className="text-white font-bold text-lg">⏳ Enregistrement...</Text>
              ) : (
                <>
                  <Ionicons name="save" size={24} color="#ffffff" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Enregistrer le rêve
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          {!formData.description.trim() && (
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mt-3">
              ℹ️ La description est obligatoire
            </Text>
          )}
        </View>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
};

