// Page des statistiques détaillées (navigation stack)

import { useRouter } from 'expo-router';
import { InsightsScreen } from '../src/screens';

export default function InsightsPageStack() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
  };

  return <InsightsScreen navigation={navigation} />;
}

