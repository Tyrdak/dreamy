// Page du calendrier

import { useRouter } from 'expo-router';
import { CalendarScreen } from '../src/screens';

export default function CalendarPage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      }
    },
    goBack: () => router.back(),
  };

  return <CalendarScreen navigation={navigation} />;
}

