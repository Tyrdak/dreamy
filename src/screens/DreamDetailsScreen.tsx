// Écran de détails d'un rêve avec édition et suppression

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components';
import { getMoonPhaseDescription } from '../services';
import { deleteDream, getDreamById } from '../storage';
import { Dream } from '../types';
import { formatDreamDate, formatDreamTime, getDreamTypeIcon } from '../utils';

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

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'négative': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View className="bg-white dark:bg-dream-dusk pt-12 pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color="#7c6df1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* En-tête du rêve */}
        <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center mb-4">
            <Text className="text-5xl mr-3">{getDreamTypeIcon(dream.type)}</Text>
            <View className="flex-1">
              {dream.title && (
                <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-1">
                  {dream.title}
                </Text>
              )}
              <Text className="text-gray-500 dark:text-gray-400">
                {formatDreamDate(dream.date)} • {formatDreamTime(dream.time)}
              </Text>
            </View>
            {dream.moonPhaseEmoji && (
              <Text className="text-4xl">{dream.moonPhaseEmoji}</Text>
            )}
          </View>

          {/* Type et Tonalité */}
          <View className="flex-row space-x-2 mb-4">
            <View className="bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-2">
              <Text className="text-primary-700 dark:text-primary-300 font-semibold capitalize">
                {dream.type}
              </Text>
            </View>
            <View className={`bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2`}>
              <Text className={`${getToneColor(dream.tone)} font-semibold capitalize`}>
                {dream.tone}
              </Text>
            </View>
          </View>
        </View>

        {/* Phase lunaire */}
        {dream.moonPhase && (
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
            <View className="flex-row items-center mb-2">
              <Ionicons name="moon" size={24} color="#fef08a" />
              <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
                Phase lunaire
              </Text>
            </View>
            <Text className="text-dream-night dark:text-dream-cloud mb-2">
              {dream.moonPhase}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {getMoonPhaseDescription(dream.moonPhase)}
            </Text>
          </View>
        )}

        {/* Description */}
        <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center mb-3">
            <Ionicons name="book" size={24} color="#7c6df1" />
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
              Description
            </Text>
          </View>
          <Text className="text-dream-night dark:text-dream-cloud leading-6">
            {dream.description}
          </Text>
        </View>

        {/* Émotions */}
        <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center mb-4">
            <Ionicons name="heart" size={24} color="#ef4444" />
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
              États émotionnels
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 dark:text-gray-400">Avant le sommeil</Text>
            <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
              {dream.emotionalStateBefore}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 dark:text-gray-400">Au réveil</Text>
            <Text className="text-dream-night dark:text-dream-cloud font-semibold capitalize">
              {dream.emotionalStateAfter}
            </Text>
          </View>

          <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 dark:text-gray-400">Intensité émotionnelle</Text>
            <Text className="text-primary-600 dark:text-primary-400 font-bold">
              {dream.emotionalIntensity}/10
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Clarté du rêve</Text>
            <Text className="text-primary-600 dark:text-primary-400 font-bold">
              {dream.clarity}/10
            </Text>
          </View>
        </View>

        {/* Lieu et personnages */}
        {(dream.location || dream.characters.length > 0) && (
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
            {dream.location && (
              <>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="location" size={24} color="#7c6df1" />
                  <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
                    Lieu
                  </Text>
                </View>
                <Text className="text-dream-night dark:text-dream-cloud mb-4">
                  {dream.location}
                </Text>
              </>
            )}

            {dream.characters.length > 0 && (
              <>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="people" size={24} color="#7c6df1" />
                  <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
                    Personnages
                  </Text>
                </View>
                <View className="flex-row flex-wrap">
                  {dream.characters.map((character, index) => (
                    <View
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-primary-700 dark:text-primary-300">
                        {character}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Tags */}
        {dream.tags.length > 0 && (
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Ionicons name="pricetag" size={24} color="#7c6df1" />
              <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
                Mots-clés
              </Text>
            </View>
            <View className="flex-row flex-wrap">
              {dream.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-gray-700 dark:text-gray-300">#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Qualité du sommeil */}
        <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bed" size={24} color="#7c6df1" />
            <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
              Qualité du sommeil
            </Text>
          </View>
          <Text className="text-dream-night dark:text-dream-cloud capitalize">
            {dream.sleepQuality}
          </Text>
        </View>

        {/* Signification personnelle */}
        {dream.personalMeaning && (
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-6 mb-4 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb" size={24} color="#fef08a" />
              <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud ml-2">
                Signification personnelle
              </Text>
            </View>
            <Text className="text-dream-night dark:text-dream-cloud leading-6">
              {dream.personalMeaning}
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

