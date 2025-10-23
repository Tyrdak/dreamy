// Page d'édition d'un rêve

import { useLocalSearchParams, useRouter } from 'expo-router';
import { EditDreamScreen } from '../src/screens';

export default function EditDreamPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const dreamId = Array.isArray(params.dreamId) ? params.dreamId[0] : params.dreamId;

  const navigation = {
    goBack: () => router.back(),
    navigate: (screen: string, params?: any) => {
      if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      }
    },
  };

  const route = {
    params: {
      dreamId,
    },
  };

  if (!dreamId) {
    router.back();
    return null;
  }

  return <EditDreamScreen navigation={navigation} route={route} />;
}

