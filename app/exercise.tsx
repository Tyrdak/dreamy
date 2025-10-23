// Page d'exercice avec timer

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExerciseScreen } from '../src/screens';
import { EXERCISES } from '../src/types';

export default function ExercisePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Récupère l'exercice depuis son ID
  const exerciseId = Array.isArray(params.exerciseId) ? params.exerciseId[0] : params.exerciseId;
  const exercise = EXERCISES.find(ex => ex.id === exerciseId);
  
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

