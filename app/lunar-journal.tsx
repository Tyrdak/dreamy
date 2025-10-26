// Page du journal lunaire

import { useRouter } from 'expo-router';
import { LunarJournalScreen } from '../src/screens';

export default function LunarJournalPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
    navigate: (screen: string, params?: any) => {
      if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      }
    },
  };

  return <LunarJournalScreen navigation={navigation} />;
}

