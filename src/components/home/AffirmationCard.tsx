import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { fetchAffirmation } from '../../services';

interface AffirmationCardProps {
  onRefresh?: () => void;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({ onRefresh }) => {
  const [affirmation, setAffirmation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [rotationValue] = useState(new Animated.Value(0));

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

  useEffect(() => {
    if (loading) {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
    } else {
      rotationValue.setValue(0);
    }
  }, [loading]);

  const handleRefresh = () => {
    loadAffirmation();
    onRefresh?.();
  };

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
          className="bg-purple-500 rounded-full p-3 shadow-lg"
          disabled={loading}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons 
              name={loading ? "refresh" : "refresh-outline"} 
              size={20} 
              color="white" 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <Text className="text-purple-700 dark:text-purple-300 text-base leading-6 italic">
        &ldquo;{loading ? '...' : affirmation}&rdquo;
      </Text>
    </View>
  );
};
