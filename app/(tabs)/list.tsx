// Page de liste des rêves

import { useRouter } from 'expo-router';
import { ListScreen } from '../../src/screens';

export default function ListPage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'AddDream') {
        router.push('/add-dream');
      } else if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      }
    },
    goBack: () => router.back(),
  };

  return <ListScreen navigation={navigation} />;
}

