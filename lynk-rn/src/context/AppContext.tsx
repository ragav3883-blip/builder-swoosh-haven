import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chennaiData, punjabData, CityData } from '@/data/cities';
import { t, Lang } from '@/i18n/translations';
import { initFirebase, signInAnonymous, signOutFirebase, signInWithGoogle, updateDisplayName, currentUser } from '@/lib/firebase';

export type AppState = {
  currentCity: 'Punjab' | 'Chennai';
  language: Lang;
  favorites: string[];
  notifications: { all: boolean; etaAlerts: boolean; promotions: boolean };
  privacy: { locationSharing: boolean };
  isLoggedIn: boolean;
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  searchQuery: string;
};

type Action =
  | { type: 'SET_CITY'; city: AppState['currentCity'] }
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'TOGGLE_FAV'; id: string }
  | { type: 'SET_USER'; user: AppState['user'] }
  | { type: 'SET_LOGIN'; value: boolean }
  | { type: 'TOGGLE_NOTIFICATION'; key: keyof AppState['notifications'] }
  | { type: 'TOGGLE_PRIVACY'; key: keyof AppState['privacy'] };

const initialState: AppState = {
  currentCity: 'Punjab',
  language: 'en',
  favorites: ['M88'],
  notifications: { all: true, etaAlerts: true, promotions: false },
  privacy: { locationSharing: true },
  isLoggedIn: false,
  user: null,
  searchQuery: ''
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, currentCity: action.city };
    case 'SET_LANG':
      return { ...state, language: action.lang };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'TOGGLE_FAV': {
      const exists = state.favorites.includes(action.id);
      const favorites = exists ? state.favorites.filter((x) => x !== action.id) : [...state.favorites, action.id];
      return { ...state, favorites };
    }
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_LOGIN':
      return { ...state, isLoggedIn: action.value };
    case 'TOGGLE_NOTIFICATION':
      return { ...state, notifications: { ...state.notifications, [action.key]: !state.notifications[action.key] } };
    case 'TOGGLE_PRIVACY':
      return { ...state, privacy: { ...state.privacy, [action.key]: !state.privacy[action.key] } };
    default:
      return state;
  }
}

const AppCtx = createContext<{ state: AppState; dispatch: React.Dispatch<Action>; data: CityData } | null>(null);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('lynk-state');
      if (raw) {
        try {
          const loaded = JSON.parse(raw) as Partial<AppState>;
          if (loaded) {
            if (loaded.currentCity) dispatch({ type: 'SET_CITY', city: loaded.currentCity });
            if (loaded.language) dispatch({ type: 'SET_LANG', lang: loaded.language });
            if (loaded.favorites) loaded.favorites.forEach((id) => dispatch({ type: 'TOGGLE_FAV', id }));
          }
        } catch {}
      }
      await initFirebase();
      await signInAnonymous();
      const user = currentUser();
      dispatch({ type: 'SET_LOGIN', value: !!user && !user.isAnonymous });
      dispatch({ type: 'SET_USER', user: user ? { displayName: user.displayName, email: user.email, photoURL: user.photoURL } : null });
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('lynk-state', JSON.stringify({
      currentCity: state.currentCity,
      language: state.language,
      favorites: state.favorites
    }));
  }, [state.currentCity, state.language, state.favorites]);

  const data = useMemo(() => (state.currentCity === 'Punjab' ? punjabData : chennaiData), [state.currentCity]);

  return <AppCtx.Provider value={{ state, dispatch, data }}>{children}</AppCtx.Provider>;
};

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export async function loginWithGoogle() {
  const cred = await signInWithGoogle();
  return cred;
}

export async function logout() {
  await signOutFirebase();
}

export async function setDisplayName(name: string) {
  await updateDisplayName(name);
}
