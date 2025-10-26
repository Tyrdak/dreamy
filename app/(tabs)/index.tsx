// Page principale - Liste des rêves

import { useRouter } from 'expo-router';
import { HomeScreen } from '../../src/screens';

export default function HomePage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'AddDream') {
        router.push('/add-dream');
      } else if (screen === 'DreamDetails') {
        router.push(`/dream-details?dreamId=${params.dreamId}`);
      } else if (screen === 'Profile') {
        router.push('/profile');
      } else if (screen === 'Constellation') {
        router.push('/constellation');
      } else if (screen === 'LunarJournal') {
        router.push('/lunar-journal');
      } else if (screen === 'Rituals') {
        router.push('/rituals');
      } else if (screen === 'Badges') {
        router.push('/badges');
      } else if (screen === 'Insights') {
        router.push('/insights');
      } else if (screen === 'Calendar') {
        router.push('/calendar');
      } else if (screen === 'List') {
        router.push('/(tabs)/list');
      }
    },
    goBack: () => router.back(),
  };

  return <HomeScreen navigation={navigation} />;
}
