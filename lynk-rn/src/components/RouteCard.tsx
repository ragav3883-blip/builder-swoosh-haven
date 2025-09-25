import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Map, Star } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { RouteDef } from '@/data/cities';
import { useNavigation } from '@react-navigation/native';

export default function RouteCard({ route }: { route: RouteDef }) {
  const { state, dispatch } = useApp();
  const nav = useNavigation<any>();
  const isFavorite = state.favorites.includes(route.id);
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={() => nav.navigate('Map', { routeId: route.id })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Map color="#3B82F6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{route.name}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>To {route.to}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{route.eta}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>ETA</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => dispatch({ type: 'TOGGLE_FAV', id: route.id })} style={{ padding: 8 }}>
        <Star color={isFavorite ? '#FBBF24' : '#9CA3AF'} fill={isFavorite ? '#FBBF24' : 'none'} />
      </Pressable>
    </View>
  );
}
