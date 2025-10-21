// Page Onboarding avec Expo Router

import { useRouter } from 'expo-router';
import { OnboardingTutorialScreen } from '../src/screens';

export default function OnboardingPage() {
  const router = useRouter();
  
  const navigation = {
    reset: (options: any) => {
      router.replace('/(tabs)');
    },
  };

  return <OnboardingTutorialScreen navigation={navigation} />;
}

