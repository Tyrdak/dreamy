// Écran Constellation - Vue graphique des rêves

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { getDreams } from '../storage';
import { Dream } from '../types';

interface ConstellationScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export const ConstellationScreen: React.FC<ConstellationScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  // Valeurs pour pan et zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    const allDreams = await getDreams();
    setDreams(allDreams);
  };

  // Génère une position en spirale pour un meilleur espacement
  const getStarPosition = (index: number, total: number) => {
    const goldenAngle = 137.5 * Math.PI / 180;
    const angle = index * goldenAngle;
    const radius = Math.sqrt(index + 1) * 40;
    
    return {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
    };
  };

  const getStarSize = (intensity: number) => {
    return 15 + (intensity / 10) * 25; // 15-40px
  };

  const getStarColor = (tone: string) => {
    switch (tone) {
      case 'positive':
        return '#10b981';
      case 'négative':
        return '#ef4444';
      default:
        return '#fef08a';
    }
  };

  // Gestes pour pan
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Gestes pour pinch zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * e.scale, 3));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const resetView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  // Composant étoile SVG
  const Star: React.FC<{ size: number; color: string; glow?: boolean }> = ({ size, color, glow }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Glow effect */}
      {glow && (
        <>
          <Polygon
            points="50,10 61,40 92,43 68,64 74,95 50,78 26,95 32,64 8,43 39,40"
            fill={color}
            fillOpacity={0.2}
            scale="1.4"
            origin="50,50"
          />
          <Polygon
            points="50,10 61,40 92,43 68,64 74,95 50,78 26,95 32,64 8,43 39,40"
            fill={color}
            fillOpacity={0.3}
            scale="1.2"
            origin="50,50"
          />
        </>
      )}
      
      {/* Étoile principale */}
      <Polygon
        points="50,10 61,40 92,43 68,64 74,95 50,78 26,95 32,64 8,43 39,40"
        fill={color}
        fillOpacity={0.9}
      />
      
      {/* Centre brillant */}
      <Polygon
        points="50,25 55,45 70,48 58,58 61,73 50,65 39,73 42,58 30,48 45,45"
        fill="#ffffff"
        fillOpacity={0.8}
      />
    </Svg>
  );

  return (
    <View className="flex-1 bg-dream-night">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="bg-dream-dusk pb-4 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            className="w-10 h-10 rounded-full bg-primary-900 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#a78bfa" />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">
              Carte des Rêves
            </Text>
            <Text className="text-white/50 text-xs">
              Pinch pour zoomer • Glissez pour explorer
            </Text>
          </View>

          <TouchableOpacity 
            onPress={resetView}
            className="w-10 h-10 rounded-full bg-primary-900 items-center justify-center"
          >
            <Ionicons name="refresh" size={20} color="#a78bfa" />
          </TouchableOpacity>
        </View>
      </View>

      {dreams.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-primary-900/30 rounded-full w-32 h-32 items-center justify-center mb-6">
            <Text className="text-7xl">✨</Text>
          </View>
          <Text className="text-white text-2xl font-bold mb-3 text-center">
            Votre constellation est vide
          </Text>
          <Text className="text-white/70 text-center leading-6 mb-6">
            Chaque rêve que vous enregistrez devient une étoile unique dans votre ciel personnel
          </Text>
          <View className="bg-primary-900/50 rounded-2xl p-4">
            <Text className="text-white/60 text-sm text-center">
              💡 La taille représente l'intensité{'\n'}
              🎨 La couleur reflète la tonalité
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          {/* Légende */}
          <View className="px-6 py-3 bg-dream-dusk/50">
            <View className="flex-row justify-center gap-4 flex-wrap">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                <Text className="text-white/60 text-xs">Positif</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5" />
                <Text className="text-white/60 text-xs">Neutre</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
                <Text className="text-white/60 text-xs">Négatif</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-purple-400 mr-1.5 border border-purple-200" />
                <Text className="text-white/60 text-xs">Lucide</Text>
              </View>
            </View>
          </View>

          {/* Carte des étoiles avec gestes */}
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.starsContainer, animatedStyle]}>
              {dreams.map((dream, index) => {
                const position = getStarPosition(index, dreams.length);
                const size = getStarSize(dream.emotionalIntensity);
                const color = getStarColor(dream.tone);

                return (
                  <TouchableOpacity
                    key={dream.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedDream(dream);
                      navigation.navigate('DreamDetails', { dreamId: dream.id });
                    }}
                    style={{
                      position: 'absolute',
                      left: position.x - size / 2,
                      top: position.y - size / 2,
                    }}
                    activeOpacity={0.8}
                  >
                    <Star 
                      size={size} 
                      color={color} 
                      glow={dream.type === 'lucide'}
                    />
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </GestureDetector>

          {/* Statistiques en bas */}
          <View className="px-6 py-4 bg-dream-dusk/95 border-t border-dream-purple/30">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{dreams.length}</Text>
                <Text className="text-white/60 text-xs">Étoiles</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">
                  {dreams.filter(d => d.type === 'lucide').length}
                </Text>
                <Text className="text-white/60 text-xs">Rêves lucides</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">
                  {(dreams.reduce((sum, d) => sum + d.emotionalIntensity, 0) / dreams.length).toFixed(1)}
                </Text>
                <Text className="text-white/60 text-xs">Intensité moy.</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    flex: 1,
    width: width * 3,
    height: height * 3,
    position: 'relative',
  },
});
