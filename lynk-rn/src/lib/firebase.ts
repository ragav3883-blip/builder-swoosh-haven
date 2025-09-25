import Constants from 'expo-constants';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, GoogleAuthProvider, signInWithCredential, signOut, updateProfile, User } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

let app: FirebaseApp | null = null;

export async function initFirebase() {
  if (getApps().length) {
    app = getApps()[0]!;
    return;
  }
  const cfg = (Constants.expoConfig?.extra as any)?.firebase;
  app = initializeApp(cfg);
}

export async function signInAnonymous() {
  const auth = getAuth();
  try {
    await signInAnonymously(auth);
  } catch {}
}

export function currentUser() {
  const auth = getAuth();
  return auth.currentUser;
}

export async function signInWithGoogle() {
  const extra = (Constants.expoConfig?.extra as any)?.google || {};
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true, scheme: 'lynk' });
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token'
  };
  const result = await AuthSession.startAsync({
    authUrl:
      `${discovery.authorizationEndpoint}?response_type=code&client_id=${encodeURIComponent(
        extra.webClientId || extra.androidClientId || extra.iosClientId
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('profile email openid')}`,
    returnUrl: redirectUri
  });
  if ((result as any).type !== 'success') return null;
  // Exchange code via Google token endpoint
  const code = (result as any).params.code;
  const body = new URLSearchParams({
    code,
    client_id: extra.webClientId || extra.androidClientId || extra.iosClientId,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  }).toString();
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  }).then((r) => r.json());
  if (!tokenRes.id_token) return null;
  const credential = GoogleAuthProvider.credential(tokenRes.id_token);
  const auth = getAuth();
  const userCred = await signInWithCredential(auth, credential);
  return userCred;
}

export async function signOutFirebase() {
  const auth = getAuth();
  await signOut(auth);
}

export async function updateDisplayName(name: string) {
  const auth = getAuth();
  if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: name });
}
