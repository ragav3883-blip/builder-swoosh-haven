import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Toggle from '@/components/Toggle';
import { useApp } from '@/context/AppContext';
import { t } from '@/i18n/translations';

export default function PrivacyScreen() {
  const { state, dispatch } = useApp();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontWeight: '800', color: '#111827' }}>{t.locationSharing[state.language]}</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>{t.locationSharingDesc[state.language]}</Text>
          </View>
          <Toggle value={state.privacy.locationSharing} onChange={() => dispatch({ type: 'TOGGLE_PRIVACY', key: 'locationSharing' })} />
        </View>
      </View>
    </ScrollView>
  );
}
