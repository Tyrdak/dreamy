// Page des paramètres

import { useRouter } from 'expo-router';
import { SettingsScreen } from '../src/screens';

export default function SettingsPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
    reset: (options: any) => {
      if (options.routes[0]?.name === 'Welcome') {
        router.replace('/welcome');
      }
    },
  };

  return <SettingsScreen navigation={navigation} />;
}

