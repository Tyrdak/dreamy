// Carte de citation quotidienne
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { DailyQuote } from '../../types';

interface QuoteCardProps {
  quote: DailyQuote | null;
  loading: boolean;
  onRefresh: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, loading, onRefresh }) => {
  return (
    <View className="px-6 mt-6">
      <View className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-6 shadow-xl">
        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-white text-lg font-bold">✨ Citation du jour</Text>
          <TouchableOpacity
            onPress={onRefresh}
            disabled={loading}
            className="bg-white/20 rounded-full p-2"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="refresh" size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        {quote ? (
          <>
            <Text className="text-white text-base italic mb-4">"{quote.text}"</Text>
            <Text className="text-white/80 text-sm">— {quote.author}</Text>
          </>
        ) : (
          <Text className="text-white/80 text-base">Chargement de votre citation...</Text>
        )}
      </View>
    </View>
  );
};

