// Page d'ajout de rêve

import { useRouter } from 'expo-router';
import { AddDreamScreen } from '../../src/screens';

export default function AddPage() {
  const router = useRouter();
  
  const navigation = {
    goBack: () => router.back(),
  };

  return <AddDreamScreen navigation={navigation} />;
}

