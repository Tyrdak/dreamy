// Formulaire de rêve réutilisable
import React from 'react';
import { ScrollView, View } from 'react-native';
import { DreamType } from '../../types';
import { SectionHeader } from '../add-dream/SectionHeader';
import { Button, Input, Picker, Slider, TagInput } from '../ui';

interface DreamFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  date: Date;
  onDateChange: (value: Date) => void;
  type: DreamType;
  onTypeChange: (value: DreamType) => void;
  tone: 'positif' | 'neutre' | 'négatif';
  onToneChange: (value: 'positif' | 'neutre' | 'négatif') => void;
  clarity: number;
  onClarityChange: (value: number) => void;
  emotions: string[];
  onEmotionsChange: (value: string[]) => void;
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  characters: string[];
  onAddCharacter: (char: string) => void;
  onRemoveCharacter: (char: string) => void;
  locations: string[];
  onAddLocation: (loc: string) => void;
  onRemoveLocation: (loc: string) => void;
  lucidityLevel: number;
  onLucidityLevelChange: (value: number) => void;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
}

export const DreamForm: React.FC<DreamFormProps> = (props) => {
  const dreamTypeOptions = [
    { label: 'Cauchemar', value: 'cauchemar', icon: '😱' },
    { label: 'Lucide', value: 'lucide', icon: '✨' },
    { label: 'Ordinaire', value: 'ordinaire', icon: '💭' },
    { label: 'Récurrent', value: 'récurrent', icon: '🔄' },
  ];

  return (
    <ScrollView className="flex-1 px-6">
      {/* Section informations de base */}
      <View className="bg-white dark:bg-dream-dusk mx-4 mt-5 rounded-3xl p-5 shadow-sm">
        <SectionHeader 
          icon="✍️" 
          title="Modifiez votre rêve" 
          subtitle="Modifiez seulement ce que vous souhaitez changer"
        />

        <Input
          label="Titre du rêve (optionnel)"
          value={props.title}
          onChangeText={props.onTitleChange}
          placeholder={props.title ? `Titre actuel: ${props.title}` : "Donnez un titre à votre rêve..."}
          multiline={false}
        />

        <Input
          label="Description (optionnel)"
          value={props.description}
          onChangeText={props.onDescriptionChange}
          placeholder={props.description ? `Description actuelle: ${props.description.substring(0, 50)}...` : "Décrivez votre rêve en détail..."}
          multiline={true}
          numberOfLines={4}
        />

        <Picker
          label="Type de rêve"
          value={props.type}
          options={dreamTypeOptions}
          onValueChange={(value) => props.onTypeChange(value as DreamType)}
        />
      </View>

      {/* Section émotions */}
      <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
        <SectionHeader 
          icon="😊" 
          title="Émotions & Clarté" 
          subtitle="Comment vous sentiez-vous ?"
        />

        <Picker
          label="Ton général"
          value={props.tone}
          options={[
            { label: 'Positif', value: 'positif', icon: '😊' },
            { label: 'Neutre', value: 'neutre', icon: '😐' },
            { label: 'Négatif', value: 'négatif', icon: '😞' },
          ]}
          onValueChange={(value) => props.onToneChange(value as 'positif' | 'neutre' | 'négatif')}
        />

        <Slider
          label="Clarté du rêve"
          value={props.clarity}
          minimumValue={1}
          maximumValue={10}
          step={1}
          onValueChange={props.onClarityChange}
        />

        {props.type === 'lucide' && (
          <Slider
            label="Niveau de lucidité"
            value={props.lucidityLevel}
            minimumValue={1}
            maximumValue={10}
            step={1}
            onValueChange={props.onLucidityLevelChange}
          />
        )}
      </View>

      {/* Section détails */}
      <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
        <SectionHeader 
          icon="🏷️" 
          title="Détails & Contexte" 
          subtitle="Tags, personnages et lieux"
        />

        <TagInput
          label="Tags"
          tags={props.tags}
          onAddTag={props.onAddTag}
          onRemoveTag={props.onRemoveTag}
          placeholder={props.tags.length > 0 ? `Tags actuels: ${props.tags.join(', ')} - Ajouter un autre...` : "Ajouter un tag..."}
        />

        <TagInput
          label="Personnages"
          tags={props.characters}
          onAddTag={props.onAddCharacter}
          onRemoveTag={props.onRemoveCharacter}
          placeholder={props.characters.length > 0 ? `Personnages actuels: ${props.characters.join(', ')} - Ajouter un autre...` : "Ajouter un personnage..."}
        />

        <TagInput
          label="Lieux"
          tags={props.locations}
          onAddTag={props.onAddLocation}
          onRemoveTag={props.onRemoveLocation}
          placeholder={props.locations.length > 0 ? `Lieux actuels: ${props.locations.join(', ')} - Ajouter un autre...` : "Ajouter un lieu..."}
        />
      </View>

      <View className="mt-6 mb-8">
        <Button title={props.submitLabel} onPress={props.onSubmit} loading={props.loading} />
      </View>
    </ScrollView>
  );
};