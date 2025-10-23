// Écran d'édition d'un rêve
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DreamForm } from '../components/dream-form';
import { useDreamForm } from '../hooks/useDreamForm';
import { fetchMoonPhase } from '../services';
import { getDreamById, updateDream } from '../storage';
import { Dream, DreamType } from '../types';

interface EditDreamScreenProps {
  navigation: any;
  route: any;
}

export const EditDreamScreen: React.FC<EditDreamScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { dreamId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalDream, setOriginalDream] = useState<Dream | null>(null);

  const form = useDreamForm(originalDream);

  useEffect(() => {
    loadDream();
  }, [dreamId]);

  const loadDream = async () => {
    try {
      const dream = await getDreamById(dreamId);
      if (!dream) {
        Alert.alert('Erreur', 'Rêve introuvable');
        navigation.goBack();
        return;
      }
      setOriginalDream(dream);
      setLoading(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le rêve');
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    // Permettre la modification partielle - pas de validation obligatoire

    try {
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const moonPhase = await fetchMoonPhase(form.date.toISOString().split('T')[0]);

      const updatedDream: Dream = {
        ...originalDream!,
        title: form.title.trim() || originalDream!.title,
        description: form.description.trim() || originalDream!.description,
        date: form.date.toISOString(),
        type: form.type as Dream['type'],
        tone: form.tone as Dream['tone'],
        clarity: form.clarity,
        emotionalStateBefore: originalDream!.emotionalStateBefore,
        emotionalStateAfter: originalDream!.emotionalStateAfter,
        emotionalIntensity: originalDream!.emotionalIntensity,
        tags: form.tags,
        characters: form.characters,
        location: form.locations.join(', ') || originalDream!.location,
        moonPhase: originalDream!.moonPhase,
        updatedAt: new Date().toISOString(),
      };

      const success = await updateDream(updatedDream);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✅ Succès', 'Votre rêve a été mis à jour !', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le rêve');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !originalDream) {
    return (
      <View className="flex-1 justify-center items-center bg-dream-cloud dark:bg-dream-night" />
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View style={{ paddingTop: insets.top + 12, backgroundColor: '#312e81' }} className="pb-5 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fef08a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
            Modifier le rêve
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <DreamForm
        title={form.title}
        onTitleChange={form.setTitle}
        description={form.description}
        onDescriptionChange={form.setDescription}
        date={form.date}
        onDateChange={form.setDate}
        type={form.type}
        onTypeChange={(value) => form.setType(value as DreamType)}
        tone={form.tone}
        onToneChange={form.setTone}
        clarity={form.clarity}
        onClarityChange={form.setClarity}
        emotions={form.emotions}
        onEmotionsChange={form.setEmotions}
        tags={form.tags}
        onAddTag={(tag) => form.setTags([...form.tags, tag])}
        onRemoveTag={(tag) => form.setTags(form.tags.filter((t) => t !== tag))}
        characters={form.characters}
        onAddCharacter={(char) => form.setCharacters([...form.characters, char])}
        onRemoveCharacter={(char) => form.setCharacters(form.characters.filter((c) => c !== char))}
        locations={form.locations}
        onAddLocation={(loc) => form.setLocations([...form.locations, loc])}
        onRemoveLocation={(loc) => form.setLocations(form.locations.filter((l) => l !== loc))}
        lucidityLevel={form.lucidityLevel}
        onLucidityLevelChange={form.setLucidityLevel}
        submitLabel="Enregistrer les modifications"
        onSubmit={handleSave}
        loading={saving}
      />
    </View>
  );
};

