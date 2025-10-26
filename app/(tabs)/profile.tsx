// Page de profil

import { useRouter } from 'expo-router';
import { ProfileScreen } from '../../src/screens';

export default function ProfilePage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'Settings') {
        router.push('/settings');
      } else if (screen === 'Insights') {
        router.push('/insights');
      } else if (screen === 'Badges') {
        router.push('/badges');
      } else if (screen === 'Constellation') {
        router.push('/constellation');
      } else if (screen === 'LunarJournal') {
        router.push('/lunar-journal');
      } else if (screen === 'Rituals') {
        router.push('/rituals');
      }
    },
    goBack: () => router.back(),
  };

  return <ProfileScreen navigation={navigation} />;
}

