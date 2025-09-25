import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp, loginWithGoogle, logout } from '@/context/AppContext';
import { t } from '@/i18n/translations';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const nav = useNavigation<any>();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 16 }}>{t.settings[state.language]}</Text>

      {state.isLoggedIn && state.user ? (
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: state.user.photoURL || 'https://placehold.co/60x60/e2e8f0/e2e8f0' }} style={{ width: 56, height: 56, borderRadius: 999, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>{state.user.displayName}</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>{state.user.email}</Text>
          </View>
        </View>
      ) : (
        <Pressable onPress={async () => { const cred = await loginWithGoogle(); if (cred?.user) { dispatch({ type: 'SET_LOGIN', value: true }); dispatch({ type: 'SET_USER', user: { displayName: cred.user.displayName, email: cred.user.email, photoURL: cred.user.photoURL } }); } }}
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={{ width: 20, height: 20, marginRight: 8 }} />
          <Text>{t.loginWithGoogle[state.language]}</Text>
        </Pressable>
      )}

      {state.isLoggedIn && (
        <>
          <Pressable onPress={() => nav.navigate('EditProfile')} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 12 }}>
            <Text>{t.editProfile[state.language]}</Text>
          </Pressable>
          <Pressable onPress={() => nav.navigate('Notifications')} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 12 }}>
            <Text>{t.notifications[state.language]}</Text>
          </Pressable>
          <Pressable onPress={() => nav.navigate('Privacy')} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 12 }}>
            <Text>{t.privacy[state.language]}</Text>
          </Pressable>
          <Text style={{ marginTop: 24, marginBottom: 8, fontWeight: '700', color: '#4B5563' }}>{t.language[state.language]}</Text>
          <Pressable onPress={() => dispatch({ type: 'SET_LANG', lang: 'en' })} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 8 }}>
            <Text>English</Text>
          </Pressable>
          <Pressable onPress={() => dispatch({ type: 'SET_LANG', lang: 'pa' })} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 8 }}>
            <Text>ਪੰਜਾਬੀ (Punjabi)</Text>
          </Pressable>
          <Pressable onPress={() => dispatch({ type: 'SET_LANG', lang: 'hi' })} style={{ backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, marginTop: 8 }}>
            <Text>हिन्दी (Hindi)</Text>
          </Pressable>
          <Pressable onPress={async () => { await logout(); dispatch({ type: 'SET_LOGIN', value: false }); dispatch({ type: 'SET_USER', user: null }); }} style={{ backgroundColor: '#FEE2E2', padding: 14, borderRadius: 10, marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: '#DC2626', fontWeight: '700' }}>{t.logout[state.language]}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
