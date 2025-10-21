// Écran des paramètres

import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exportDreamsAsJSON, exportDreamsAsText, exportStatsAsText } from '../services';
import { getDreams, getSettings, getUserProfile, resetAllData, updateSettings } from '../storage';
import { Settings } from '../types';
import { calculateDreamStatistics } from '../utils';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentSettings = await getSettings();
    setSettings(currentSettings);
    setLoading(false);
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!settings) return;

    if (enabled) {
      // Demander la permission
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Veuillez activer les notifications dans les paramètres de votre appareil'
        );
        return;
      }
    }

    const updatedSettings = { ...settings, notificationsEnabled: enabled };
    setSettings(updatedSettings);
    await updateSettings(updatedSettings);
  };

  const handleChangeNotificationTime = () => {
    Alert.alert(
      'Heure de rappel',
      'Cette fonctionnalité sera bientôt disponible',
      [{ text: 'OK' }]
    );
  };

  const handleChangeTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (!settings) return;
    const updatedSettings = { ...settings, theme };
    setSettings(updatedSettings);
    updateSettings(updatedSettings);
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Réinitialiser les données',
      'Cette action supprimera TOUS vos rêves et paramètres. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            const success = await resetAllData();
            if (success) {
              Alert.alert(
                'Succès',
                'Toutes les données ont été supprimées',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                      });
                    },
                  },
                ]
              );
            } else {
              Alert.alert('Erreur', 'Impossible de réinitialiser les données');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    Alert.alert(
      'Exporter vos rêves',
      'Choisissez le format d\'export',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Format JSON',
          onPress: async () => {
            const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
            const success = await exportDreamsAsJSON(dreams, profile?.username || 'Rêveur');
            if (success) {
              Alert.alert('✅ Export réussi', 'Vos rêves ont été exportés en JSON');
            } else {
              Alert.alert('Erreur', 'Impossible d\'exporter les données');
            }
          },
        },
        {
          text: 'Format Texte',
          onPress: async () => {
            const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
            const success = await exportDreamsAsText(dreams, profile?.username || 'Rêveur');
            if (success) {
              Alert.alert('✅ Export réussi', 'Votre journal a été exporté en texte lisible');
            } else {
              Alert.alert('Erreur', 'Impossible d\'exporter les données');
            }
          },
        },
      ]
    );
  };

  const handleExportStats = async () => {
    const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
    const stats = calculateDreamStatistics(dreams);
    const success = await exportStatsAsText(stats, profile?.username || 'Rêveur');
    if (success) {
      Alert.alert('✅ Export réussi', 'Vos statistiques ont été exportées');
    } else {
      Alert.alert('Erreur', 'Impossible d\'exporter les statistiques');
    }
  };

  if (loading || !settings) {
    return (
      <View className="flex-1 bg-dream-cloud dark:bg-dream-night justify-center items-center">
        <Text className="text-primary-600 text-lg">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12 }}
        className="bg-white dark:bg-dream-dusk pb-4 px-6 border-b border-gray-200 dark:border-dream-purple shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#7c6df1" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-dream-night dark:text-dream-cloud">
            Paramètres
          </Text>
          
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Notifications */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            🔔 Notifications
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-1">
                  Activer les rappels
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Recevez un rappel quotidien pour noter vos rêves
                </Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
                thumbColor={settings.notificationsEnabled ? '#7c6df1' : '#f3f4f6'}
              />
            </View>

            {settings.notificationsEnabled && (
              <TouchableOpacity
                onPress={handleChangeNotificationTime}
                className="flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <Text className="text-dream-night dark:text-dream-cloud">
                  Heure du rappel
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-primary-600 dark:text-primary-400 mr-2">
                    {settings.notificationTime}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#7c6df1" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Apparence */}
        <View className="px-6 mt-2">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            🎨 Apparence
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
            <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-3">
              Thème
            </Text>
            
            <View className="space-y-2">
              {[
                { value: 'light' as const, label: 'Clair', icon: 'sunny' },
                { value: 'dark' as const, label: 'Sombre', icon: 'moon' },
                { value: 'auto' as const, label: 'Automatique', icon: 'phone-portrait' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleChangeTheme(option.value)}
                  className={`
                    flex-row items-center justify-between p-3 rounded-xl
                    ${settings.theme === option.value ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-50 dark:bg-gray-800'}
                  `.trim()}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={settings.theme === option.value ? '#7c6df1' : '#9ca3af'}
                    />
                    <Text
                      className={`ml-3 ${
                        settings.theme === option.value
                          ? 'text-primary-700 dark:text-primary-300 font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                  
                  {settings.theme === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#7c6df1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Mode Lucide */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            ✨ Mode Rêve Lucide
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-1 mr-4">
                <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-1">
                  Activer le mode lucide
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Recevez des reality checks aléatoires
                </Text>
              </View>
              <Switch
                value={settings.lucidModeEnabled}
                onValueChange={(enabled) => updateSettings({ lucidModeEnabled: enabled })}
                trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
                thumbColor={settings.lucidModeEnabled ? '#7c6df1' : '#f3f4f6'}
              />
            </View>

            {settings.lucidModeEnabled && (
              <View className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Fréquence des reality checks
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-dream-night dark:text-dream-cloud">
                    Toutes les {settings.realityCheckFrequency} heures
                  </Text>
                  <View className="flex-row space-x-2">
                    {[2, 4, 6, 8].map((hours) => (
                      <TouchableOpacity
                        key={hours}
                        onPress={() => updateSettings({ realityCheckFrequency: hours })}
                        className={`
                          px-3 py-2 rounded-lg
                          ${settings.realityCheckFrequency === hours ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                        `.trim()}
                      >
                        <Text
                          className={
                            settings.realityCheckFrequency === hours
                              ? 'text-white font-semibold'
                              : 'text-gray-600 dark:text-gray-400'
                          }
                        >
                          {hours}h
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Données */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            💾 Données
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg space-y-3">
            <TouchableOpacity
              onPress={handleExportData}
              className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="download" size={20} color="#7c6df1" />
                <View className="ml-3 flex-1">
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Exporter mes rêves
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    JSON ou Texte
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportStats}
              className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="bar-chart" size={20} color="#7c6df1" />
                <View className="ml-3 flex-1">
                  <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                    Exporter les statistiques
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    Vos analyses en texte
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResetData}
              className="flex-row items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="trash" size={20} color="#ef4444" />
                <View className="ml-3 flex-1">
                  <Text className="text-red-600 dark:text-red-400 font-semibold">
                    Réinitialiser toutes les données
                  </Text>
                  <Text className="text-red-500 dark:text-red-400 text-sm">
                    Action irréversible
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* À propos */}
        <View className="px-6 mt-6 mb-8">
          <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud mb-4">
            ℹ️ À propos
          </Text>
          
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4 shadow-lg">
            <Text className="text-dream-night dark:text-dream-cloud mb-2">
              <Text className="font-semibold">Dreamy</Text> - Journal de Rêves
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              Version 1.0.0
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
              Explorez l'univers fascinant de vos rêves. Cette application vous aide à mieux comprendre votre monde intérieur grâce à l'analyse de vos expériences oniriques.
            </Text>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

