// Page Welcome avec Expo Router

import { useRouter } from 'expo-router';
import { WelcomeScreen } from '../src/screens';

export default function WelcomePage() {
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string) => {
      if (screen === 'OnboardingTutorial') {
        router.push('/onboarding');
      }
    },
  };

  return <WelcomeScreen navigation={navigation} />;
}

