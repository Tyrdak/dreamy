// Écran calendrier des rêves

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DreamCard } from '../components';
import { getMoonPhase } from '../services';
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

  // Marque les dates avec des rêves
  const getMarkedDates = () => {
    const marked: any = {};
    
    dreams.forEach(dream => {
      const dateKey = dream.date;
      marked[dateKey] = {
        marked: true,
        dotColor: '#7c6df1',
      };
    });

    // Ajoute la sélection
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#7c6df1',
    };

    return marked;
  };

  const handleDayPress = (day: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(day.dateString);
    updateDreamsForDate(day.dateString, dreams);
  };

  const moonPhase = getMoonPhase(new Date(selectedDate));

  // Statistiques du mois
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

  // Message personnalisé selon le jour sélectionné
  const getDateMessage = () => {
    const today = new Date().toISOString().split('T')[0];
    const selected = new Date(selectedDate);
    const now = new Date();
    
    if (selectedDate === today) {
      return "Aujourd'hui";
    } else if (selected > now) {
      return "À venir";
    } else {
      const daysAgo = Math.floor((now.getTime() - selected.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo === 1) return "Hier";
      if (daysAgo < 7) return `Il y a ${daysAgo} jours`;
      if (daysAgo < 30) return `Il y a ${Math.floor(daysAgo / 7)} semaine${Math.floor(daysAgo / 7) > 1 ? 's' : ''}`;
      return `Il y a ${Math.floor(daysAgo / 30)} mois`;
    }
  };

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-5 px-6"
      >
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#7c6df1" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud">
              Calendrier
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const today = new Date().toISOString().split('T')[0];
              setSelectedDate(today);
              updateDreamsForDate(today, dreams);
            }}
            className="bg-primary-600 rounded-full px-4 py-2"
          >
            <Text className="text-white font-semibold text-xs">
              Aujourd'hui
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats du mois */}
        <View className="flex-row justify-around mt-2">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-600">{monthStats.total}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">rêves ce mois</Text>
          </View>
          <View className="w-px bg-gray-200 dark:bg-gray-700" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-600">{monthStats.daysWithDreams}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">jours notés</Text>
          </View>
          <View className="w-px bg-gray-200 dark:bg-gray-700" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-600">{monthStats.avgPerDay}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">moy./jour</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Calendrier */}
        <View className="bg-white dark:bg-dream-dusk mx-4 mt-5 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#7c6df1',
              selectedDayBackgroundColor: '#7c6df1',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#fef08a',
              todayBackgroundColor: '#312e81',
              dayTextColor: '#1e1b4b',
              textDisabledColor: '#d1d5db',
              dotColor: '#fef08a',
              selectedDotColor: '#ffffff',
              arrowColor: '#7c6df1',
              monthTextColor: '#1e1b4b',
              textMonthFontWeight: 'bold',
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 13,
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 16,
            }}
            enableSwipeMonths={true}
          />
        </View>

        {/* Info sur la date sélectionnée */}
        <View className="px-6 mt-5 mb-4">
          <View className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-5 shadow-lg">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-white/70 text-xs mb-1 uppercase tracking-wider">
                  {getDateMessage()}
                </Text>
                <Text className="text-white font-bold text-lg mb-1 capitalize">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long',
                  })}
                </Text>
                <Text className="text-white/60 text-xs">
                  {new Date(selectedDate).getFullYear()}
                </Text>
              </View>
              
              {/* Phase lunaire */}
              <View className="items-center bg-white/20 rounded-2xl px-4 py-3">
                <Text className="text-4xl mb-1">{moonPhase.emoji}</Text>
                <Text className="text-white/90 text-xs font-medium text-center">
                  {moonPhase.phaseName}
                </Text>
              </View>
            </View>
            
            {/* Nombre de rêves ce jour */}
            <View className="bg-white/10 rounded-2xl px-4 py-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-white/70 text-sm mr-2">💭</Text>
                <Text className="text-white/90 text-sm">
                  {dreamsForSelectedDate.length === 0 
                    ? 'Aucun rêve noté'
                    : `${dreamsForSelectedDate.length} rêve${dreamsForSelectedDate.length > 1 ? 's' : ''} noté${dreamsForSelectedDate.length > 1 ? 's' : ''}`
                  }
                </Text>
              </View>
              {dreamsForSelectedDate.length > 0 && (
                <View className="bg-white/20 rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-white font-bold text-xs">{dreamsForSelectedDate.length}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Rêves de ce jour */}
        <View className="px-6 mb-4">
          {dreamsForSelectedDate.length === 0 ? (
            <View className="bg-white dark:bg-dream-dusk rounded-3xl p-10 items-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <View className="bg-primary-100 dark:bg-primary-900 rounded-full w-20 h-20 items-center justify-center mb-4">
                <Text className="text-5xl">💤</Text>
              </View>
              <Text className="text-gray-700 dark:text-gray-300 text-center font-medium mb-2">
                Aucun rêve noté ce jour
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
                {selectedDate === new Date().toISOString().split('T')[0]
                  ? "Notez vos rêves d'aujourd'hui pour commencer"
                  : "Sélectionnez un autre jour pour voir vos rêves"
                }
              </Text>
            </View>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
                  Rêves du jour
                </Text>
                <View className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1">
                  <Text className="text-primary-700 dark:text-primary-300 font-bold text-sm">
                    {dreamsForSelectedDate.length}
                  </Text>
                </View>
              </View>
              
              <View className="gap-3">
                {dreamsForSelectedDate.map(dream => (
                  <TouchableOpacity
                    key={dream.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('DreamDetails', { dreamId: dream.id });
                    }}
                  >
                    <DreamCard
                      dream={dream}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('DreamDetails', { dreamId: dream.id });
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        <View className="h-12" />
      </ScrollView>
    </View>
  );
};

