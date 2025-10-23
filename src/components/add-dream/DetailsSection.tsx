// Section détails et contexte
import React from 'react';
import { View } from 'react-native';
import { Input, Picker, Slider, TagInput } from '..';
import { SleepQuality, Tone } from '../../types';
import { SectionHeader } from './SectionHeader';

interface DetailsSectionProps {
  clarity: number;
  location: string;
  characters: string[];
  tags: string[];
  sleepQuality: SleepQuality;
  personalMeaning: string;
  tone: Tone;
  sleepQualityOptions: Array<{ label: string; value: string }>;
  toneOptions: Array<{ label: string; value: string; icon: string }>;
  onClarityChange: (clarity: number) => void;
  onLocationChange: (location: string) => void;
  onCharactersChange: (characters: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onSleepQualityChange: (quality: SleepQuality) => void;
  onPersonalMeaningChange: (meaning: string) => void;
  onToneChange: (tone: Tone) => void;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  clarity,
  location,
  characters,
  tags,
  sleepQuality,
  personalMeaning,
  tone,
  sleepQualityOptions,
  toneOptions,
  onClarityChange,
  onLocationChange,
  onCharactersChange,
  onTagsChange,
  onSleepQualityChange,
  onPersonalMeaningChange,
  onToneChange,
}) => {
  return (
    <>
      <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
        <SectionHeader 
          icon="🌟" 
          title="Détails & Contexte" 
          subtitle="Enrichissez votre souvenir"
        />

        <Slider
          label="Clarté du rêve"
          value={clarity}
          onValueChange={onClarityChange}
          minimumValue={1}
          maximumValue={10}
          step={1}
          leftLabel="Flou"
          rightLabel="Net"
        />

        <Input
          label="Lieu du rêve"
          value={location}
          onChangeText={onLocationChange}
          placeholder="Ex: Une forêt enchantée, ma maison d'enfance..."
        />

        <TagInput
          label="Personnages présents"
          tags={characters}
          onAddTag={(character) => onCharactersChange([...characters, character])}
          onRemoveTag={(character) => onCharactersChange(characters.filter(c => c !== character))}
          placeholder="Ajoutez des personnages..."
        />

        <TagInput
          label="Mots-clés"
          tags={tags}
          onAddTag={(tag) => onTagsChange([...tags, tag])}
          onRemoveTag={(tag) => onTagsChange(tags.filter(t => t !== tag))}
          placeholder="Ajoutez des tags..."
        />
      </View>

      <View className="bg-white dark:bg-dream-dusk mx-4 mt-4 rounded-3xl p-5 shadow-sm">
        <SectionHeader 
          icon="🧠" 
          title="Analyse & Interprétation" 
          subtitle="Donnez du sens"
        />

        <Picker
          label="Qualité du sommeil"
          value={sleepQuality}
          options={sleepQualityOptions}
          onValueChange={(value) => onSleepQualityChange(value as SleepQuality)}
        />

        <Picker
          label="Tonalité générale"
          value={tone}
          options={toneOptions}
          onValueChange={(value) => onToneChange(value as Tone)}
        />

        <Input
          label="Signification personnelle"
          value={personalMeaning}
          onChangeText={onPersonalMeaningChange}
          placeholder="Que signifie ce rêve pour vous ? Quelles réflexions vous inspire-t-il ?"
          multiline
          rows={4}
        />
      </View>
    </>
  );
};

