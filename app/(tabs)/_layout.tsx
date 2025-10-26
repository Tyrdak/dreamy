// Layout des onglets avec bottom navigation animée

import { Tabs } from 'expo-router';
import { AnimatedTabBar } from '../../src/components/ui/AnimatedTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Liste',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
