// Écran de détails d'un rêve avec édition et suppression
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DetailsCard, DreamHeader, EmotionsCard, InfoCard } from '../components/dream-details';
import { Button } from '../components/ui';
import { getAffirmationForDream, shareDreamAsFile } from '../services';
import { deleteDream, getDreamById } from '../storage';
import { Dream } from '../types';

interface DreamDetailsScreenProps {
  navigation: any;
  route: any;
}

export const DreamDetailsScreen: React.FC<DreamDetailsScreenProps> = ({ navigation, route }) => {
  const { dreamId } = route.params;
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDream();
  }, [dreamId]);

  const loadDream = async () => {
    const loadedDream = await getDreamById(dreamId);
    setDream(loadedDream);
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le rêve',
      'Êtes-vous sûr de vouloir supprimer ce rêve ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteDream(dreamId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer le rêve');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditDream', { dreamId });
  };

  const handleShare = async () => {
    if (!dream) return;
    
    try {
      const success = await shareDreamAsFile(dream);
      if (success) {
        Alert.alert('Succès', 'Votre rêve a été partagé !');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le rêve');
    }
  };

  const handleShowAffirmation = async () => {
    if (!dream) return;
    
    try {
      const affirmation = await getAffirmationForDream(dream);
      Alert.alert(
        'Affirmation personnalisée',
        affirmation,
        [{ text: 'Merci', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'affirmation');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-primary-600 text-lg">Chargement...</Text>
      </View>
    );
  }

  if (!dream) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center px-6">
        <Text className="text-6xl mb-4">😴</Text>
        <Text className="text-xl font-semibold text-dream-night dark:text-dream-cloud mb-2">
          Rêve introuvable
        </Text>
        <Button title="Retour" onPress={() => navigation.goBack()} variant="outline" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View className="bg-white dark:bg-dream-dusk pt-12 pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          <View className="flex-row space-x-6 gap-4">
            <TouchableOpacity 
              onPress={handleShowAffirmation}
              className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900"
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="sparkles-outline" size={24} color="#f59e0b" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare}
              className="p-2 rounded-lg bg-green-50 dark:bg-green-900"
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="share-outline" size={24} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleEdit}
              className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900"
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="create-outline" size={24} color="#7c6df1" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDelete}
              className="p-2 rounded-lg bg-red-50 dark:bg-red-900"
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <DreamHeader
          type={dream.type}
          title={dream.title}
          date={dream.date}
          time={dream.time}
          tone={dream.tone}
          moonPhaseEmoji={dream.moonPhaseEmoji}
        />

        <InfoCard icon="book" iconColor="#7c6df1" title="Description">
          <Text className="text-dream-night dark:text-dream-cloud leading-6">
            {dream.description}
          </Text>
        </InfoCard>

        <EmotionsCard
          emotionalStateBefore={dream.emotionalStateBefore}
          emotionalStateAfter={dream.emotionalStateAfter}
          emotionalIntensity={dream.emotionalIntensity}
        />

        <DetailsCard
          location={dream.location}
          characters={dream.characters}
          tags={dream.tags}
          clarity={dream.clarity}
          sleepQuality={dream.sleepQuality}
        />

        {dream.personalMeaning && (
          <InfoCard icon="bulb" iconColor="#f59e0b" title="Signification personnelle">
            <Text className="text-dream-night dark:text-dream-cloud leading-6">
              {dream.personalMeaning}
            </Text>
          </InfoCard>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
