// Page d'exercice avec timer

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExerciseScreen } from '../src/screens';

export default function ExercisePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Récupère l'exercice depuis les params
  const exercise = params.exercise ? JSON.parse(params.exercise as string) : null;
  
  const navigation = {
    goBack: () => router.back(),
  };

  const route = {
    params: {
      exercise,
    },
  };

  if (!exercise) {
    router.back();
    return null;
  }

  return <ExerciseScreen navigation={navigation} route={route} />;
}

