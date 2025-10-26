// Composant chip pour les tags

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TagChipProps {
  label: string;
  onPress?: () => void;
  onRemove?: () => void;
  selected?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  onPress,
  onRemove,
  selected = false,
  variant = 'default',
}) => {
  const variantClasses = {
    default: selected
      ? 'bg-primary-100 border-primary-500'
      : 'bg-gray-100 dark:bg-dream-dusk border-gray-300',
    primary: 'bg-primary-500 border-primary-600',
    secondary: 'bg-dream-purple border-dream-dusk',
  };

  const textColorClasses = {
    default: selected ? 'text-primary-700' : 'text-gray-700 dark:text-gray-300',
    primary: 'text-white',
    secondary: 'text-white',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        ${variantClasses[variant]}
        border
        rounded-full
        px-3
        py-1.5
        flex-row
        items-center
        m-1
      `.trim()}
    >
      <Text className={`${textColorClasses[variant]} text-sm font-medium`}>
        {label}
      </Text>
      
      {onRemove && (
        <TouchableOpacity onPress={onRemove} className="ml-2">
          <Ionicons
            name="close-circle"
            size={16}
            color={variant === 'default' ? (selected ? '#7c6df1' : '#6b7280') : '#ffffff'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  label?: string;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  label = 'Tags',
  placeholder = 'Ajouter un tag...',
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onAddTag(trimmedValue);
      setInputValue('');
    }
  };

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-dream-night dark:text-dream-cloud text-sm font-semibold mb-2">
          {label}
        </Text>
      )}
      
      <View className="flex-row items-center bg-white dark:bg-dream-dusk border-2 border-gray-200 dark:border-dream-purple rounded-xl px-4 py-2">
        <TextInput
          className="flex-1 text-dream-night dark:text-dream-cloud h-10"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        
        {inputValue.trim() && (
          <TouchableOpacity onPress={handleAddTag} className="ml-2">
            <Ionicons name="add-circle" size={24} color="#7c6df1" />
          </TouchableOpacity>
        )}
      </View>
      
      {tags.length > 0 && (
        <View className="flex-row flex-wrap mt-2">
          {tags.map((tag, index) => (
            <TagChip
              key={index}
              label={tag}
              onRemove={() => onRemoveTag(tag)}
              variant="primary"
            />
          ))}
        </View>
      )}
    </View>
  );
};

