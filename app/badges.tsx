// Page des badges et récompenses

import { useRouter } from 'expo-router';
import { BadgesScreen } from '../src/screens';

export default function BadgesPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
  };

  return <BadgesScreen navigation={navigation} />;
}

