import React from 'react'
import { StyleSheet, AppState } from 'react-native'
import ThemedView from '../views/ThemedView'
import { supabase } from '../lib/supabase'
import { Text } from 'react-native-paper'
import SignInWithGoogleButton from '../components/buttons/SignInWithGoogleButton'


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  return (
    <ThemedView style={styles.container}>
      <Text variant='displayMedium' style={styles.text}>Welcome to SleepDuo</Text>
      <Text variant='bodyLarge' style={styles.text}>Please sign in to start adding sleep journal records.</Text>
      <SignInWithGoogleButton />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
  }
})