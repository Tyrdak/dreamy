// Header du formulaire d'ajout de rêve
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FormHeaderProps {
  progress: number;
  onClose: () => void;
  topInset: number;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ progress, onClose, topInset }) => {
  return (
    <View style={{ paddingTop: topInset + 12, backgroundColor: '#312e81' }} className="pb-5 px-6">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <Ionicons name="close" size={22} color="#fef08a" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold" style={{ color: '#fef08a' }}>
            ✨ Nouveau Rêve
          </Text>
          <Text style={{ color: '#a78bfa' }} className="text-xs mt-0.5">
            Capturez vos aventures nocturnes
          </Text>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      <View className="mt-2">
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ color: '#a78bfa' }} className="text-xs font-medium">
            Complété
          </Text>
          <Text style={{ color: '#fef08a' }} className="font-bold text-xs">
            {progress}%
          </Text>
        </View>
        <View className="bg-white/10 rounded-full h-2.5 overflow-hidden">
          <View 
            style={{ width: `${progress}%`, backgroundColor: '#fef08a' }}
            className="h-full rounded-full"
          />
        </View>
      </View>
    </View>
  );
};

