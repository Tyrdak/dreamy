// Hook pour gérer l'état du formulaire de rêve
import { useState } from 'react';
import { Dream, DreamType } from '../types';

export interface DreamFormState {
  title: string;
  description: string;
  date: Date;
  type: DreamType;
  tone: 'positif' | 'neutre' | 'négatif';
  clarity: number;
  emotions: string[];
  tags: string[];
  characters: string[];
  locations: string[];
  lucidityLevel: number;
}

export const useDreamForm = (initialDream?: Dream | null) => {
  const [title, setTitle] = useState(initialDream?.title || '');
  const [description, setDescription] = useState(initialDream?.description || '');
  const [date, setDate] = useState(initialDream ? new Date(initialDream.date) : new Date());
  const [type, setType] = useState<DreamType>(
    initialDream?.type || 'ordinaire'
  );
  const [tone, setTone] = useState<'positif' | 'neutre' | 'négatif'>(initialDream?.tone || 'neutre');
  const [clarity, setClarity] = useState(initialDream?.clarity || 5);
  const [emotions, setEmotions] = useState<string[]>(initialDream?.emotions || []);
  const [tags, setTags] = useState<string[]>(initialDream?.tags || []);
  const [characters, setCharacters] = useState<string[]>(initialDream?.characters || []);
  const [locations, setLocations] = useState<string[]>(initialDream?.locations || []);
  const [lucidityLevel, setLucidityLevel] = useState(initialDream?.lucidityLevel || 0);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setType('ordinaire');
    setTone('neutre');
    setClarity(5);
    setEmotions([]);
    setTags([]);
    setCharacters([]);
    setLocations([]);
    setLucidityLevel(0);
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    type,
    setType,
    tone,
    setTone,
    clarity,
    setClarity,
    emotions,
    setEmotions,
    tags,
    setTags,
    characters,
    setCharacters,
    locations,
    setLocations,
    lucidityLevel,
    setLucidityLevel,
    resetForm,
  };
};

