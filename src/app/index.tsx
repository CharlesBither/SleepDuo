import { useState, useEffect, useCallback } from 'react'
import { Redirect, useRouter } from 'expo-router';

import Auth from './Auth';
import ThemedView from '../views/ThemedView';

import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { initHealthConnect } from '../lib/healthConnectInitialize';
import { setErrorMsg } from '../stores/error';
import LoadingScreen from '../views/LoadingScreen';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter();

  const renderErrorScreen = useCallback((error: any): void => {
    setErrorMsg(error);
    router.replace("/ErrorScreen");
  }, [router])

  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  })

  // set the session state
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    initHealthConnect()
      .then(() => setIsLoading(false))
      .catch(error => renderErrorScreen(error))
  }, [renderErrorScreen])

  if (isLoading) {
    return <LoadingScreen />
  } else {
    return session && session.user ? <ThemedView><Redirect href="/(tabs)/home" /></ThemedView> : <ThemedView><Auth /></ThemedView>
  }
}