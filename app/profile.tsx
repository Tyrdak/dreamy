// Page de profil (navigation stack)

import { useRouter } from 'expo-router';
import { ProfileScreen } from '../src/screens';

export default function ProfilePageStack() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'Settings') {
        router.push('/settings');
      } else if (screen === 'Insights') {
        router.push('/insights');
      }
    },
    goBack: () => router.back(),
  };

  return <ProfileScreen navigation={navigation} />;
}

