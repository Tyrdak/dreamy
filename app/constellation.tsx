// Page de la constellation de rêves

import { useRouter } from 'expo-router';
import { ConstellationScreen } from '../src/screens';

export default function ConstellationPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
    navigate: (screen: string, params?: any) => {
      if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      }
    },
  };

  return <ConstellationScreen navigation={navigation} />;
}

