import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { setDisplayName, useApp } from '@/context/AppContext';
import { t } from '@/i18n/translations';

export default function EditProfileScreen() {
  const { state } = useApp();
  const [name, setName] = useState(state.user?.displayName || '');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 6, fontWeight: '700', color: '#374151' }}>{t.fullName[state.language]}</Text>
        <TextInput value={name} onChangeText={setName} style={{ backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }} />
      </View>
      <Pressable onPress={async () => { await setDisplayName(name); }} style={{ backgroundColor: '#3B82F6', borderRadius: 10, padding: 14, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>{t.save[state.language]}</Text>
      </Pressable>
    </ScrollView>
  );
}
