// Écran de liste des rêves avec recherche et filtres
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, DreamCard } from '../components';
import { FilterButton, FilterModal, SearchBar } from '../components/list';
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

  const loadDreams = async () => {
    const loadedDreams = await getDreams();
    setDreams(sortDreamsByDate(loadedDreams));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDreams();
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadDreams(); }, []));

  useEffect(() => {
    const currentFilters = { ...filters, searchQuery };
    setFilteredDreams(filterDreams(dreams, currentFilters));
  }, [dreams, filters, searchQuery]);

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

  const toggleTagFilter = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const toggleCharacterFilter = (character: string) => {
    const currentCharacters = filters.characters || [];
    const newCharacters = currentCharacters.includes(character)
      ? currentCharacters.filter(c => c !== character)
      : [...currentCharacters, character];
    setFilters({ ...filters, characters: newCharacters.length > 0 ? newCharacters : undefined });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (filters.type?.length || 0) +
    (filters.tone?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.characters?.length || 0) +
    (searchQuery ? 1 : 0);

  const getAllTags = () => {
    const allTags = dreams.flatMap(dream => dream.tags);
    return [...new Set(allTags)].sort();
  };

  const getAllCharacters = () => {
    const allCharacters = dreams.flatMap(dream => dream.characters);
    return [...new Set(allCharacters)].sort();
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View style={{ paddingTop: insets.top + 12 }} className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
            Tous mes rêves
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {dreams.length} {dreams.length <= 1 ? 'rêve' : 'rêves'}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <FilterButton
            activeFiltersCount={activeFiltersCount}
            onPress={() => setShowFilters(true)}
          />
        </View>
      </View>

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
              : "Aucun rêve ne correspond à votre recherche"}
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

      <TouchableOpacity
        onPress={() => navigation.navigate('AddDream')}
        className="absolute bottom-8 right-6 bg-primary-600 rounded-full w-16 h-16 items-center justify-center shadow-2xl"
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={34} color="#ffffff" />
      </TouchableOpacity>

      <FilterModal
        visible={showFilters}
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        filteredDreamsCount={filteredDreams.length}
        allTags={getAllTags()}
        allCharacters={getAllCharacters()}
        onClose={() => setShowFilters(false)}
        onToggleType={toggleTypeFilter}
        onToggleTone={toggleToneFilter}
        onToggleTag={toggleTagFilter}
        onToggleCharacter={toggleCharacterFilter}
        onClear={clearFilters}
      />
    </View>
  );
};
