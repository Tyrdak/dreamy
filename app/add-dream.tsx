// Page d'ajout de rêve (navigation stack)

import { useRouter } from 'expo-router';
import { AddDreamScreen } from '../src/screens';

export default function AddDreamPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
  };

  return <AddDreamScreen navigation={navigation} />;
}

