// Modal de filtres
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, TagChip } from '..';
import { DreamFilters, DreamType, Tone } from '../../types';

interface FilterModalProps {
  visible: boolean;
  filters: DreamFilters;
  activeFiltersCount: number;
  filteredDreamsCount: number;
  allTags: string[];
  allCharacters: string[];
  onClose: () => void;
  onToggleType: (type: DreamType) => void;
  onToggleTone: (tone: Tone) => void;
  onToggleTag: (tag: string) => void;
  onToggleCharacter: (character: string) => void;
  onClear: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  activeFiltersCount,
  filteredDreamsCount,
  allTags,
  allCharacters,
  onClose,
  onToggleType,
  onToggleTone,
  onToggleTag,
  onToggleCharacter,
  onClear,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-dream-dusk rounded-t-3xl max-h-[80%]">
          <View className="p-6 border-b border-gray-200 dark:border-dream-purple">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
                Filtrer mes rêves
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Affinez votre recherche pour retrouver vos rêves plus facilement
            </Text>
            {activeFiltersCount > 0 && (
              <TouchableOpacity onPress={onClear} className="mt-3 self-start">
                <Text className="text-primary-600 font-semibold text-sm">
                  ✕ Tout réinitialiser
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView className="p-6">
            <View className="mb-6">
              <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                Quel type de rêve ?
              </Text>
              <View className="flex-row flex-wrap">
                {(['cauchemar', 'lucide', 'ordinaire', 'récurrent', 'prémonitoire'] as DreamType[]).map((type) => (
                  <TagChip
                    key={type}
                    label={type}
                    selected={filters.type?.includes(type)}
                    onPress={() => onToggleType(type)}
                  />
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                Quelle ambiance ?
              </Text>
              <View className="flex-row flex-wrap">
                {(['positive', 'neutre', 'négative'] as Tone[]).map((tone) => (
                  <TagChip
                    key={tone}
                    label={tone}
                    selected={filters.tone?.includes(tone)}
                    onPress={() => onToggleTone(tone)}
                  />
                ))}
              </View>
            </View>

            {allTags.length > 0 && (
              <View className="mb-6">
                <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                  Mots-clés
                </Text>
                <View className="flex-row flex-wrap">
                  {allTags.map((tag) => (
                    <TagChip
                      key={tag}
                      label={tag}
                      selected={filters.tags?.includes(tag)}
                      onPress={() => onToggleTag(tag)}
                    />
                  ))}
                </View>
              </View>
            )}

            {allCharacters.length > 0 && (
              <View className="mb-6">
                <Text className="text-dream-night dark:text-dream-cloud font-bold text-lg mb-2">
                  Personnages
                </Text>
                <View className="flex-row flex-wrap">
                  {allCharacters.map((character) => (
                    <TagChip
                      key={character}
                      label={character}
                      selected={filters.characters?.includes(character)}
                      onPress={() => onToggleCharacter(character)}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View className="p-6 border-t border-gray-200 dark:border-dream-purple">
            <Button
              title={activeFiltersCount > 0 ? `Voir les résultats (${filteredDreamsCount})` : 'Fermer'}
              onPress={onClose}
              variant="primary"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

