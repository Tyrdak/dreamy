// Vue calendrier
import * as Haptics from 'expo-haptics';
import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CalendarViewProps {
  selectedDate: string;
  markedDates: any;
  onDayPress: (day: any) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  markedDates,
  onDayPress,
}) => {
  const handleDayPress = (day: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDayPress(day);
  };

  return (
    <View className="bg-white dark:bg-dream-dusk rounded-2xl shadow-lg overflow-hidden mb-4">
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: '#7c6df1',
          selectedDayBackgroundColor: '#7c6df1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#7c6df1',
          dayTextColor: '#1f2937',
          textDisabledColor: '#d1d5db',
          dotColor: '#7c6df1',
          selectedDotColor: '#ffffff',
          arrowColor: '#7c6df1',
          monthTextColor: '#1f2937',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

