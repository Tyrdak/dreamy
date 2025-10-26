import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fetchAffirmation } from '../../services';

interface AffirmationCardProps {
  onRefresh?: () => void;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({ onRefresh }) => {
  const [affirmation, setAffirmation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadAffirmation = async () => {
    try {
      setLoading(true);
      const newAffirmation = await fetchAffirmation();
      setAffirmation(newAffirmation);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'affirmation:', error);
      setAffirmation('Chaque jour est une nouvelle opportunité de grandir et d\'apprendre.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAffirmation();
  }, []);

  const handleRefresh = () => {
    loadAffirmation();
    onRefresh?.();
  };

  return (
    <View className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl p-4 mx-6 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="bg-purple-500 rounded-full p-2 mr-3">
            <Ionicons name="sparkles" size={20} color="white" />
          </View>
          <Text className="text-lg font-bold text-purple-800 dark:text-purple-200">
            Affirmation du jour
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-purple-200 dark:bg-purple-700 rounded-full p-2"
          disabled={loading}
        >
          <Ionicons 
            name={loading ? "refresh" : "refresh-outline"} 
            size={16} 
            color="#7c3aed" 
          />
        </TouchableOpacity>
      </View>
      
      <Text className="text-purple-700 dark:text-purple-300 text-base leading-6 italic">
        &ldquo;{loading ? '...' : affirmation}&rdquo;
      </Text>
    </View>
  );
};
