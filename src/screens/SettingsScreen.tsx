// Écran des paramètres
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SectionHeader, SettingButton, SettingRow } from '../components/settings';
import {
  exportDreamsAsJSON,
  exportDreamsAsText,
  exportStatsAsText,
  sendTestNotification
} from '../services';
import { getDreams, getSettings, resetAllData, updateSettings } from '../storage';
import { Settings } from '../types';
import { calculateDreamStatistics } from '../utils';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentSettings = await getSettings();
    setSettings(currentSettings);
  };

  const updateSetting = async (key: keyof Settings, value: any) => {
    const updated = { ...settings!, [key]: value };
    await updateSettings({ [key]: value });
    setSettings(updated);
  };

  const handleExportJSON = async () => {
    try {
      const dreams = await getDreams();
      const { getUserProfile } = await import('../storage');
      const profile = await getUserProfile();
      await exportDreamsAsJSON(dreams, profile?.username || 'User');
      Alert.alert('Succès', 'Vos rêves ont été exportés en JSON !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  const handleExportText = async () => {
    try {
      const dreams = await getDreams();
      const { getUserProfile } = await import('../storage');
      const profile = await getUserProfile();
      await exportDreamsAsText(dreams, profile?.username || 'User');
      Alert.alert('Succès', 'Vos rêves ont été exportés en texte !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  const handleExportStats = async () => {
    try {
      const dreams = await getDreams();
      const stats = calculateDreamStatistics(dreams);
      const { getUserProfile } = await import('../storage');
      const profile = await getUserProfile();
      await exportStatsAsText(stats, profile?.username || 'User');
      Alert.alert('Succès', 'Vos statistiques ont été exportées !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les statistiques');
    }
  };

  const handleTestNotification = async () => {
    await sendTestNotification('daily');
    Alert.alert('Test', 'Notification de test envoyée !');
  };

  const handleTestLucidMode = async () => {
    try {
      // Envoie une notification de test pour le mode lucide
      await sendTestNotification('lucid');
      Alert.alert('Test', 'Notification de contrôle de réalité envoyée !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la notification de test');
    }
  };

  const handleResetData = async () => {
    Alert.alert(
      '⚠️ Attention',
      'Êtes-vous sûr de vouloir supprimer TOUTES vos données ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            Alert.alert('✅ Succès', 'Toutes les données ont été supprimées');
            navigation.navigate('Welcome');
          },
        },
      ]
    );
  };

  if (!settings) {
    return (
      <View className="flex-1 justify-center items-center bg-dream-cloud dark:bg-dream-night">
        <Text className="text-primary-600">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      <View
        style={{ paddingTop: insets.top + 12, backgroundColor: '#312e81' }}
        className="pb-4 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fef08a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
            Paramètres
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1">
        <SectionHeader icon="🔔" title="Notifications" />
        <View className="bg-white dark:bg-dream-dusk mx-6 rounded-2xl p-4 shadow">
          <SettingRow
            title="Notifications"
            subtitle="Rappels quotidiens pour noter vos rêves"
            value={settings.notificationsEnabled}
            onValueChange={(val) => updateSetting('notificationsEnabled', val)}
          />
          {settings.notificationsEnabled && (
            <SettingButton
              title="Tester la notification"
              subtitle="Recevoir une notification de test"
              icon="notifications"
              onPress={handleTestNotification}
            />
          )}
        </View>

        <SectionHeader icon="✨" title="Mode Lucide" />
        <View className="bg-white dark:bg-dream-dusk mx-6 rounded-2xl p-4 shadow">
          <SettingRow
            title="Mode Lucide"
            subtitle="Activer les fonctionnalités pour les rêves lucides"
            value={settings.lucidModeEnabled}
            onValueChange={(val) => updateSetting('lucidModeEnabled', val)}
          />
          {settings.lucidModeEnabled && (
            <View className="mt-4">
              <Text className="text-dream-night dark:text-dream-cloud text-sm font-medium mb-2">
                Fréquence des contrôles de réalité
              </Text>
              <Text className="text-gray-500 text-xs mb-3">
                Toutes les {settings.realityCheckFrequency} heures
              </Text>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() => updateSetting('realityCheckFrequency', Math.max(1, settings.realityCheckFrequency - 1))}
                  className="bg-primary-100 dark:bg-primary-900 rounded-full w-8 h-8 items-center justify-center"
                >
                  <Text className="text-primary-600 dark:text-primary-400 font-bold">-</Text>
                </TouchableOpacity>
                <Text className="text-dream-night dark:text-dream-cloud font-semibold min-w-[40px] text-center">
                  {settings.realityCheckFrequency}h
                </Text>
                <TouchableOpacity
                  onPress={() => updateSetting('realityCheckFrequency', Math.min(24, settings.realityCheckFrequency + 1))}
                  className="bg-primary-100 dark:bg-primary-900 rounded-full w-8 h-8 items-center justify-center"
                >
                  <Text className="text-primary-600 dark:text-primary-400 font-bold">+</Text>
                </TouchableOpacity>
              </View>
              
              <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <SettingButton
                  title="Tester la notification lucide"
                  subtitle="Recevoir une notification de contrôle de réalité"
                  icon="bulb"
                  onPress={handleTestLucidMode}
                />
              </View>
            </View>
          )}
        </View>

        <SectionHeader icon="📤" title="Export des données" />
        <View className="px-6">
          <SettingButton
            title="Exporter en JSON"
            subtitle="Format lisible par machine"
            icon="code"
            onPress={handleExportJSON}
          />
          <SettingButton
            title="Exporter en texte"
            subtitle="Format lisible par humain"
            icon="document-text"
            onPress={handleExportText}
          />
          <SettingButton
            title="Exporter les statistiques"
            subtitle="Résumé de vos rêves"
            icon="stats-chart"
            onPress={handleExportStats}
          />
        </View>

        <SectionHeader icon="ℹ️" title="À propos" />
        <View className="px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-2xl p-4">
            <Text className="text-dream-night dark:text-dream-cloud text-center mb-2 font-semibold">
              Dreamy - Journal de Rêves
            </Text>
            <Text className="text-gray-500 text-center text-sm">Version 1.0.0</Text>
          </View>
        </View>

        <SectionHeader icon="⚠️" title="Zone de danger" />
        <View className="px-6">
          <SettingButton
            title="Supprimer toutes les données"
            subtitle="Action irréversible"
            icon="trash"
            onPress={handleResetData}
            variant="danger"
          />
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
