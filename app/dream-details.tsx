// Page de détails d'un rêve

import { useLocalSearchParams, useRouter } from 'expo-router';
import { DreamDetailsScreen } from '../src/screens';

export default function DreamDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const navigation = {
    navigate: (screen: string, routeParams?: any) => {
      if (screen === 'EditDream') {
        router.push(`/edit-dream?dreamId=${routeParams.dreamId}`);
      }
    },
    goBack: () => router.back(),
  };

  const route = {
    params: {
      dreamId: params.dreamId,
    },
  };

  return <DreamDetailsScreen navigation={navigation} route={route} />;
}

