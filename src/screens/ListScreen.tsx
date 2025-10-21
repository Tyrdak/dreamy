// Écran de liste des rêves avec recherche et filtres

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, DreamCard, TagChip } from '../components';
import { getDreams } from '../storage';
import { Dream, DreamFilters, DreamType, Tone } from '../types';
import { filterDreams, sortDreamsByDate } from '../utils';

interface ListScreenProps {
  navigation: any;
}

export const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DreamFilters>({});

  // Charge les rêves
  const loadDreams = async () => {
    const loadedDreams = await getDreams();
    const sortedDreams = sortDreamsByDate(loadedDreams);
    setDreams(sortedDreams);
  };

  // Rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDreams();
    setRefreshing(false);
  };

  // Charge les rêves au focus de l'écran
  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [])
  );

  // Applique les filtres
  useEffect(() => {
    const currentFilters = { ...filters, searchQuery };
    const filtered = filterDreams(dreams, currentFilters);
    setFilteredDreams(filtered);
  }, [dreams, filters, searchQuery]);

  // Gestion des filtres
  const toggleTypeFilter = (type: DreamType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ ...filters, type: newTypes.length > 0 ? newTypes : undefined });
  };

  const toggleToneFilter = (tone: Tone) => {
    const currentTones = filters.tone || [];
    const newTones = currentTones.includes(tone)
      ? currentTones.filter(t => t !== tone)
      : [...currentTones, tone];
    setFilters({ ...filters, tone: newTones.length > 0 ? newTones : undefined });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (filters.type?.length || 0) +
    (filters.tone?.length || 0) +
    (searchQuery ? 1 : 0);

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm"
      >
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
            Tous mes rêves
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {dreams.length} {dreams.length <= 1 ? 'rêve' : 'rêves'}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-dream-night rounded-2xl px-4 h-14">
            <Ionicons name="search" size={22} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-dream-night dark:text-dream-cloud text-base"
              placeholder="Chercher dans mes rêves..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={22} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`
              ${activeFiltersCount > 0 ? 'bg-primary-600' : 'bg-gray-100 dark:bg-dream-night'}
              rounded-2xl w-14 h-14 items-center justify-center
            `.trim()}
          >
            <Ionicons
              name="options-outline"
              size={26}
              color={activeFiltersCount > 0 ? '#ffffff' : '#7c6df1'}
            />
            {activeFiltersCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-primary-600 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
                <Text className="text-white text-xs font-bold">{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Dreams List */}
      {filteredDreams.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text className="text-7xl mb-6">🌙</Text>
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-3 text-center">
            {dreams.length === 0 ? 'Aucun rêve enregistré' : 'Aucun rêve trouvé'}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center text-base leading-6 mb-8">
            {dreams.length === 0
              ? "Commencez à noter vos rêves pour les retrouver ici"
              : "Aucun rêve ne correspond à votre recherche. Essayez d'autres mots-clés !"}
          </Text>
          {dreams.length === 0 && (
            <Button
              title="Créer mon premier rêve"
              onPress={() => navigation.navigate('AddDream')}
              variant="primary"
              icon={<Ionicons name="add" size={20} color="#ffffff" />}
            />
          )}
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onPress={() => navigation.navigate('DreamDetails', { dreamId: dream.id })}
            />
          ))}
          
          <View className="h-24" />
        </ScrollView>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddDream')}
        className="absolute bottom-8 right-6 bg-primary-600 rounded-full w-16 h-16 items-center justify-center shadow-2xl"
        activeOpacity={0.7}
        style={{
          shadowColor: '#7c6df1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={34} color="#ffffff" />
      </TouchableOpacity>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-dream-dusk rounded-t-3xl max-h-[80%]">
            {/* Modal Header */}
            <View className="p-6 border-b border-gray-200 dark:border-dream-purple">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
                  Filtrer mes rêves
                </Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <Ionicons name="close-circle" size={32} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                Affinez votre recherche pour retrouver vos rêves plus facilement
              </Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={clearFilters} className="mt-3 self-start">
                  <Text className="text-primary-600 font-semibold text-sm">
                    ✕ Tout réinitialiser
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView className="p-6">
              {/* Type de rêve */}
              <View className="mb-6">
                <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                  Quel type de rêve ?
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  Sélectionnez un ou plusieurs types
                </Text>
                <View className="flex-row flex-wrap">
                  {(['cauchemar', 'lucide', 'ordinaire', 'récurrent', 'prémonitoire'] as DreamType[]).map((type) => (
                    <TagChip
                      key={type}
                      label={type}
                      selected={filters.type?.includes(type)}
                      onPress={() => toggleTypeFilter(type)}
                    />
                  ))}
                </View>
              </View>

              {/* Tonalité */}
              <View className="mb-6">
                <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                  Quelle ambiance ?
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  Filtrez par tonalité émotionnelle
                </Text>
                <View className="flex-row flex-wrap">
                  {(['positive', 'neutre', 'négative'] as Tone[]).map((tone) => (
                    <TagChip
                      key={tone}
                      label={tone}
                      selected={filters.tone?.includes(tone)}
                      onPress={() => toggleToneFilter(tone)}
                    />
                  ))}
                </View>
              </View>

              <View className="h-20" />
            </ScrollView>

            {/* Apply Button */}
            <View className="p-6 border-t border-gray-200 dark:border-dream-purple">
              <Button
                title={activeFiltersCount > 0 ? `Voir les résultats (${filteredDreams.length})` : 'Fermer'}
                onPress={() => setShowFilters(false)}
                variant="primary"
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

