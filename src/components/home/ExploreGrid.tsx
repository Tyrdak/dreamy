// Grille d'exploration
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ExploreGridProps {
  onNavigate: (screen: string) => void;
}

const exploreItems = [
  { id: 'Calendar', emoji: '📅', title: 'Calendrier', subtitle: 'Par dates', color: 'bg-primary-600' },
  { id: 'Constellation', emoji: '⭐', title: 'Constellation', subtitle: 'En étoiles', color: 'bg-purple-600' },
  { id: 'LunarJournal', emoji: '🌙', title: 'Lune', subtitle: 'Phases', color: 'bg-yellow-600' },
  { id: 'Insights', emoji: '📊', title: 'Stats', subtitle: 'Analyses', color: 'bg-indigo-600' },
  { id: 'Badges', emoji: '🏆', title: 'Badges', subtitle: 'Trophées', color: 'bg-green-600' },
  { id: 'Rituals', emoji: '🧘', title: 'Zen', subtitle: 'Relaxation', color: 'bg-blue-600' },
];

export const ExploreGrid: React.FC<ExploreGridProps> = ({ onNavigate }) => {
  return (
    <View>
      <Text className="text-base font-semibold text-dream-night dark:text-dream-cloud mb-3">
        Explorer autrement
      </Text>
      <View className="gap-3">
        {/* Groupe par ligne de 2 */}
        {[0, 2, 4].map((startIndex) => (
          <View key={startIndex} className="flex-row gap-3">
            {exploreItems.slice(startIndex, startIndex + 2).map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onNavigate(item.id)}
                className={`flex-1 ${item.color} rounded-3xl p-5 shadow-lg`}
                activeOpacity={0.8}
              >
                <Text className="text-4xl mb-2">{item.emoji}</Text>
                <Text className="text-white font-bold">{item.title}</Text>
                <Text className="text-white/70 text-xs mt-1">{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

