// Page des rituels du sommeil

import { useRouter } from 'expo-router';
import { RitualsScreen } from '../src/screens';

export default function RitualsPage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'Exercise') {
        // Passe l'exerciseId via query params
        router.push(`/exercise?exerciseId=${params.exerciseId}`);
      }
    },
    goBack: () => router.back(),
  };

  return <RitualsScreen navigation={navigation} />;
}

