// Écran calendrier des rêves
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarView, DateHeader, MonthStatsCard } from '../components/calendar';
import { DreamCard } from '../components/ui';
import { getDreams } from '../storage';
import { Dream } from '../types';

interface CalendarScreenProps {
  navigation: any;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dreamsForSelectedDate, setDreamsForSelectedDate] = useState<Dream[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDreams();
    }, [])
  );

  const loadDreams = async () => {
    const allDreams = await getDreams();
    setDreams(allDreams);
    updateDreamsForDate(selectedDate, allDreams);
  };

  const updateDreamsForDate = (date: string, allDreams: Dream[]) => {
    const dreamsOnDate = allDreams.filter(dream => dream.date === date);
    setDreamsForSelectedDate(dreamsOnDate);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    dreams.forEach(dream => {
      marked[dream.date] = { marked: true, dotColor: '#7c6df1' };
    });
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#7c6df1',
    };
    return marked;
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    updateDreamsForDate(day.dateString, dreams);
  };

  const monthStats = useMemo(() => {
    const currentMonth = new Date(selectedDate).getMonth();
    const currentYear = new Date(selectedDate).getFullYear();
    const dreamsThisMonth = dreams.filter(dream => {
      const dreamDate = new Date(dream.date);
      return dreamDate.getMonth() === currentMonth && dreamDate.getFullYear() === currentYear;
    });
    const daysWithDreams = new Set(dreamsThisMonth.map(d => d.date)).size;
    return {
      total: dreamsThisMonth.length,
      daysWithDreams,
      avgPerDay: daysWithDreams > 0 ? (dreamsThisMonth.length / daysWithDreams).toFixed(1) : '0',
    };
  }, [dreams, selectedDate]);

  const getDateMessage = () => {
    const today = new Date().toISOString().split('T')[0];
    const selected = new Date(selectedDate);
    const now = new Date();
    if (selectedDate === today) return "Aujourd'hui";
    if (selected > now) return "À venir";
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate === yesterday.toISOString().split('T')[0]) return "Hier";
    const diffTime = Math.abs(now.getTime() - selected.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 ? `Il y a ${diffDays} jours` : 'Passé';
  };

  const getFormattedDate = () => {
    return new Date(selectedDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
            Calendrier
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <MonthStatsCard {...monthStats} />

        <CalendarView
          selectedDate={selectedDate}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
        />

        <DateHeader
          dateMessage={getDateMessage()}
          formattedDate={getFormattedDate()}
          dreamsCount={dreamsForSelectedDate.length}
        />

        {dreamsForSelectedDate.length === 0 ? (
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-8 items-center">
            <Text className="text-6xl mb-3">💤</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              Aucun rêve enregistré ce jour-là
            </Text>
          </View>
        ) : (
          dreamsForSelectedDate.map(dream => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onPress={() => navigation.navigate('DreamDetails', { dreamId: dream.id })}
            />
          ))
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
