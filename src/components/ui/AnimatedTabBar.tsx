// Navbar animée personnalisée

import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#312e81', // dream-dusk
        borderTopWidth: 0,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
        paddingTop: 12,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            key={route.key}
            isFocused={isFocused}
            label={label as string}
            onPress={onPress}
            options={options}
          />
        );
      })}
    </View>
  );
}

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  onPress: () => void;
  options: any;
}

function TabBarButton({ isFocused, label, onPress, options }: TabBarButtonProps) {
  const opacity = useSharedValue(isFocused ? 1 : 0.5);

  React.useEffect(() => {
    opacity.value = withTiming(isFocused ? 1 : 0.5, { duration: 250 });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const iconName = getIconName(label);
  const color = isFocused ? '#fef08a' : '#a78bfa'; // moon ou lavender

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
      }}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedIconStyle}>
        <Ionicons name={iconName} size={26} color={color} />
      </Animated.View>

      {/* Label avec animation */}
      <Animated.Text
        style={[
          {
            fontSize: 11,
            marginTop: 4,
            fontWeight: isFocused ? '600' : '400',
          },
          useAnimatedStyle(() => ({
            color: withTiming(isFocused ? '#fef08a' : '#a78bfa', { duration: 250 }),
            opacity: withTiming(isFocused ? 1 : 0.7, { duration: 250 }),
          })),
        ]}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

function getIconName(label: string): any {
  const icons: Record<string, any> = {
    Accueil: 'home',
    Liste: 'list',
    Ajouter: 'add-circle',
    Profil: 'person',
  };
  return icons[label] || 'ellipse';
}

