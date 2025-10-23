// Écran des paramètres

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exportDreamsAsJSON, exportDreamsAsText, exportStatsAsText, getAllScheduledNotifications, initializeNotifications, scheduleCustomDailyNotification, sendTestNotification } from '../services';
import { getDreams, getSettings, getUserProfile, resetAllData, updateSettings } from '../storage';
import { Settings } from '../types';
import { calculateDreamStatistics } from '../utils';

interface SettingsScreenProps {
  navigation: any;
}

// Composant pour les en-têtes de section
const SectionHeader: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <View className="px-6 mt-6 mb-3">
    <View className="flex-row items-center">
      <Text className="text-2xl mr-2">{icon}</Text>
      <Text className="text-lg font-bold text-dream-night dark:text-dream-cloud">
        {title}
      </Text>
    </View>
  </View>
);

// Composant pour les lignes de paramètres avec switch
const SettingRow: React.FC<{
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: string;
}> = ({ title, subtitle, value, onValueChange, icon }) => (
  <View className="flex-row justify-between items-center py-3">
    <View className="flex-1 mr-4">
      {icon && <Text className="text-xl mb-1">{icon}</Text>}
      <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-1">
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: '#a78bfa' }} className="text-sm">
          {subtitle}
        </Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={(val) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(val);
      }}
      trackColor={{ false: '#d1d5db', true: '#fef08a' }}
      thumbColor={value ? '#312e81' : '#f3f4f6'}
    />
  </View>
);

// Composant pour les boutons d'action
const SettingButton: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  iconColor?: string;
}> = ({ title, subtitle, icon, onPress, variant = 'default', iconColor }) => {
  const isDanger = variant === 'danger';
  const bgClass = isDanger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800';
  const textColor = isDanger ? 'text-red-600 dark:text-red-400' : 'text-dream-night dark:text-dream-cloud';
  const subtitleColor = isDanger ? 'text-red-500 dark:text-red-400' : '#a78bfa';
  const iconCol = iconColor || (isDanger ? '#ef4444' : '#fef08a');

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${bgClass}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: '#312e81' }}
        >
          <Ionicons name={icon as any} size={20} color={iconCol} />
        </View>
        <View className="flex-1">
          <Text className={`font-semibold ${textColor}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm" style={{ color: typeof subtitleColor === 'string' ? subtitleColor : '#a78bfa' }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDanger ? '#ef4444' : '#a78bfa'} />
    </TouchableOpacity>
  );
};

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
    
    const updatedSettings = { ...settings, notificationsEnabled: enabled };
    setSettings(updatedSettings);
    await updateSettings(updatedSettings);
    
    // Réinitialise les notifications
    await initializeNotifications({
      dailyReminderEnabled: enabled,
      dailyReminderTime: updatedSettings.notificationTime,
      lucidModeEnabled: updatedSettings.lucidModeEnabled,
      dailyQuoteEnabled: updatedSettings.dailyQuoteEnabled,
    });
    
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        '✅ Notifications activées',
        `Vous recevrez un rappel quotidien à ${updatedSettings.notificationTime}`,
        [{ text: 'Super !' }]
      );
    }
  };

  const handleToggleDailyQuote = async (enabled: boolean) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, dailyQuoteEnabled: enabled };
    setSettings(updatedSettings);
    await updateSettings(updatedSettings);
    
    await initializeNotifications({
      dailyReminderEnabled: updatedSettings.notificationsEnabled,
      dailyReminderTime: updatedSettings.notificationTime,
      lucidModeEnabled: updatedSettings.lucidModeEnabled,
      dailyQuoteEnabled: enabled,
    });
    
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        '💭 Citation du jour',
        'Vous recevrez une citation inspirante chaque matin à 8h',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangeNotificationTime = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    Alert.alert(
      '⏰ Choisir l\'heure',
      'Sélectionnez l\'heure de votre rappel quotidien',
      [
        { text: 'Annuler', style: 'cancel' },
        ...['06:00', '07:00', '08:00', '09:00', '20:00', '21:00', '22:00'].map(time => ({
          text: time,
          onPress: async () => {
            if (!settings) return;
            const updatedSettings = { ...settings, notificationTime: time };
            setSettings(updatedSettings);
            await updateSettings(updatedSettings);
            
            await scheduleCustomDailyNotification(
              parseInt(time.split(':')[0]),
              parseInt(time.split(':')[1])
            );
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('✅ Heure mise à jour', `Rappel quotidien à ${time}`);
          },
        })),
      ]
    );
  };

  const handleTestNotification = async (type: 'daily' | 'lucid' | 'quote') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const success = await sendTestNotification(type);
      
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          '✅ Test envoyé !',
          `Notification programmée dans 2 secondes.\n\n💡 Mettez l'app en arrière-plan pour la voir apparaître.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '❌ Erreur',
          'Activez les notifications dans les réglages de votre appareil.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', String(error));
    }
  };

  const handleShowScheduled = async () => {
    const scheduled = await getAllScheduledNotifications();
    
    if (scheduled.length === 0) {
      Alert.alert('📭 Aucune notification planifiée', '', [{ text: 'OK' }]);
    } else {
      Alert.alert(
        `📬 ${scheduled.length} notification(s)`,
        scheduled.map((n, i) => `${i + 1}. ${n.content.title}`).join('\n'),
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangeTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (!settings) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedSettings = { ...settings, theme };
    setSettings(updatedSettings);
    updateSettings(updatedSettings);
  };

  const handleToggleLucidMode = async (enabled: boolean) => {
    if (!settings) return;
    const updatedSettings = { ...settings, lucidModeEnabled: enabled };
    setSettings(updatedSettings);
    await updateSettings(updatedSettings);
    
    await initializeNotifications({
      dailyReminderEnabled: updatedSettings.notificationsEnabled,
      dailyReminderTime: updatedSettings.notificationTime,
      lucidModeEnabled: enabled,
      dailyQuoteEnabled: updatedSettings.dailyQuoteEnabled,
    });
    
    if (enabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        '✨ Mode Lucide activé',
        'Vous recevrez des "reality checks" aléatoires dans la journée',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Attention',
      'Cette action va SUPPRIMER TOUS vos rêves, badges, statistiques et paramètres.\n\nCette action est IRRÉVERSIBLE.',
      [
        { 
          text: 'Annuler', 
          style: 'cancel',
          onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        },
        {
          text: 'Tout supprimer',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            const success = await resetAllData();
            if (success) {
              Alert.alert(
                '✅ Données supprimées',
                'Toutes vos données ont été effacées',
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      '📥 Exporter vos rêves',
      'Choisissez le format d\'export',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Format JSON (technique)',
          onPress: async () => {
            const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
            const success = await exportDreamsAsJSON(dreams, profile?.username || 'Rêveur');
            if (success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('✅ Exporté !', 'Vos rêves ont été exportés en JSON');
            } else {
              Alert.alert('Erreur', 'Impossible d\'exporter les données');
            }
          },
        },
        {
          text: 'Format Texte (lisible)',
          onPress: async () => {
            const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
            const success = await exportDreamsAsText(dreams, profile?.username || 'Rêveur');
            if (success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('✅ Exporté !', 'Votre journal a été exporté en texte');
            } else {
              Alert.alert('Erreur', 'Impossible d\'exporter les données');
            }
          },
        },
      ]
    );
  };

  const handleExportStats = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const [dreams, profile] = await Promise.all([getDreams(), getUserProfile()]);
    const stats = calculateDreamStatistics(dreams);
    const success = await exportStatsAsText(stats, profile?.username || 'Rêveur');
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('✅ Exporté !', 'Vos statistiques ont été exportées');
    } else {
      Alert.alert('Erreur', 'Impossible d\'exporter les statistiques');
    }
  };

  if (loading || !settings) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#312e81' }}>
        <Text className="text-lg" style={{ color: '#fef08a' }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dream-cloud dark:bg-dream-night">
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top + 12, backgroundColor: '#312e81' }}
        className="pb-4 px-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fef08a" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold" style={{ color: '#fef08a' }}>
            Paramètres
          </Text>
          
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <SectionHeader icon="🔔" title="Notifications" />
        <View className="px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-sm">
            {/* Rappel quotidien */}
            <SettingRow
              title="Rappel quotidien"
              subtitle="Notez vos rêves chaque jour"
              value={settings.notificationsEnabled}
              onValueChange={handleToggleNotifications}
            />

            {settings.notificationsEnabled && (
              <>
                <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                
                <TouchableOpacity
                  onPress={handleChangeNotificationTime}
                  className="flex-row justify-between items-center py-2"
                >
                  <Text style={{ color: '#a78bfa' }} className="text-sm">
                    Heure du rappel
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-dream-night dark:text-dream-cloud font-semibold mr-2">
                      {settings.notificationTime}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#a78bfa" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleTestNotification('daily')}
                  className="mt-3 rounded-2xl py-3 items-center"
                  style={{ backgroundColor: '#312e81' }}
                >
                  <Text className="font-semibold" style={{ color: '#fef08a' }}>
                    🔔 Tester le rappel
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Citation du jour */}
            <View className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
            
            <SettingRow
              title="Citation du jour"
              subtitle="Recevez une citation à 8h"
              value={settings.dailyQuoteEnabled}
              onValueChange={handleToggleDailyQuote}
            />

            {settings.dailyQuoteEnabled && (
              <TouchableOpacity
                onPress={() => handleTestNotification('quote')}
                className="mt-2 rounded-2xl py-3 items-center"
                style={{ backgroundColor: '#a78bfa20', borderWidth: 1, borderColor: '#a78bfa' }}
              >
                <Text className="font-semibold text-dream-night dark:text-dream-cloud">
                  💭 Tester la citation
                </Text>
              </TouchableOpacity>
            )}

            {/* Bouton voir notifications planifiées */}
            {(settings.notificationsEnabled || settings.dailyQuoteEnabled || settings.lucidModeEnabled) && (
              <>
                <View className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                <TouchableOpacity
                  onPress={handleShowScheduled}
                  className="py-2"
                >
                  <Text className="text-center text-sm" style={{ color: '#a78bfa' }}>
                    📋 Voir toutes les notifications planifiées
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Apparence */}
        <SectionHeader icon="🎨" title="Apparence" />
        <View className="px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-sm">
            <Text className="text-dream-night dark:text-dream-cloud font-semibold mb-3">
              Thème de l'application
            </Text>
            
            <View className="gap-2">
              {[
                { value: 'light' as const, label: 'Clair ☀️', icon: 'sunny' },
                { value: 'dark' as const, label: 'Sombre 🌙', icon: 'moon' },
                { value: 'auto' as const, label: 'Automatique 📱', icon: 'phone-portrait' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleChangeTheme(option.value)}
                  className="flex-row items-center justify-between p-3 rounded-xl"
                  style={{
                    backgroundColor: settings.theme === option.value ? '#a78bfa20' : '#f3f4f6',
                    borderWidth: settings.theme === option.value ? 2 : 0,
                    borderColor: '#a78bfa',
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-medium ${
                      settings.theme === option.value
                        ? 'text-dream-night dark:text-dream-cloud'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {option.label}
                  </Text>
                  
                  {settings.theme === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#a78bfa" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Mode Lucide */}
        <SectionHeader icon="✨" title="Rêves Lucides" />
        <View className="px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-sm">
            <SettingRow
              title="Mode Lucide"
              subtitle="Reality checks aléatoires dans la journée"
              value={settings.lucidModeEnabled}
              onValueChange={handleToggleLucidMode}
            />

            {settings.lucidModeEnabled && (
              <>
                <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                
                <Text style={{ color: '#a78bfa' }} className="text-sm mb-3">
                  Nombre de reality checks par jour
                </Text>
                <View className="flex-row gap-2">
                  {[3, 5, 7, 10].map((count) => (
                    <TouchableOpacity
                      key={count}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        updateSettings({ realityCheckFrequency: count });
                        setSettings({ ...settings, realityCheckFrequency: count });
                      }}
                      className="flex-1 py-3 rounded-xl items-center"
                      style={{
                        backgroundColor: settings.realityCheckFrequency === count ? '#312e81' : '#f3f4f6',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        className="font-semibold"
                        style={{
                          color: settings.realityCheckFrequency === count ? '#fef08a' : '#6b7280',
                        }}
                      >
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleTestNotification('lucid')}
                  className="mt-3 rounded-2xl py-3 items-center"
                  style={{ backgroundColor: '#fef08a20', borderWidth: 1, borderColor: '#fef08a' }}
                >
                  <Text className="font-semibold text-dream-night dark:text-dream-cloud">
                    ✨ Tester un reality check
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Données */}
        <SectionHeader icon="💾" title="Vos données" />
        <View className="px-6">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-sm">
            <SettingButton
              icon="download"
              title="Exporter mes rêves"
              subtitle="JSON ou Texte"
              onPress={handleExportData}
            />

            <SettingButton
              icon="bar-chart"
              title="Exporter les statistiques"
              subtitle="Vos analyses en texte"
              onPress={handleExportStats}
            />

            <SettingButton
              icon="trash"
              title="Tout supprimer"
              subtitle="Action irréversible !"
              onPress={handleResetData}
              variant="danger"
            />
          </View>
        </View>

        {/* Test (Debug) */}
        <SectionHeader icon="🧪" title="Tests & Debug" />
        <View className="px-6">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Test');
            }}
            className="bg-white dark:bg-dream-dusk rounded-3xl p-4 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: '#312e81' }}
              >
                <Ionicons name="flask" size={20} color="#fef08a" />
              </View>
              <View>
                <Text className="text-dream-night dark:text-dream-cloud font-semibold">
                  Page de test
                </Text>
                <Text style={{ color: '#a78bfa' }} className="text-xs">
                  Tester l'API et les notifications
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a78bfa" />
          </TouchableOpacity>
        </View>

        {/* À propos */}
        <SectionHeader icon="ℹ️" title="À propos" />
        <View className="px-6 mb-8">
          <View className="bg-white dark:bg-dream-dusk rounded-3xl p-5 shadow-sm">
            <View className="items-center mb-4">
              <Text className="text-5xl mb-3">🌙</Text>
              <Text className="text-2xl font-bold text-dream-night dark:text-dream-cloud mb-1">
                Dreamy
              </Text>
              <Text style={{ color: '#a78bfa' }} className="text-sm mb-3">
                Version 1.0.0
              </Text>
            </View>
            
            <Text className="text-gray-600 dark:text-gray-400 text-sm text-center leading-5">
              Explorez l'univers fascinant de vos rêves 🌌
              {'\n\n'}
              Analysez, comprenez et redécouvrez votre monde intérieur à travers vos aventures nocturnes.
            </Text>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};
