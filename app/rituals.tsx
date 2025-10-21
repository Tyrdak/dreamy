// Page des rituels du sommeil

import { useRouter } from 'expo-router';
import { RitualsScreen } from '../src/screens';

export default function RitualsPage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'Exercise') {
        // Encode l'exercice en JSON pour le passer via query params
        router.push(`/exercise?exercise=${encodeURIComponent(JSON.stringify(params.exercise))}`);
      }
    },
    goBack: () => router.back(),
  };

  return <RitualsScreen navigation={navigation} />;
}

