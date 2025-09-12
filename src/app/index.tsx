import { useState, useEffect } from 'react'
import { Redirect } from 'expo-router';

import Auth from './Auth';
import ThemedView from '../views/ThemedView';

import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import LoadingScreen from './LoadingScreen';

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    setIsLoading(false)
  })

  // set the session state
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  } else {
    return session && session.user ? <ThemedView><Redirect href="/(tabs)/home"/></ThemedView> : <ThemedView><Auth /></ThemedView>
  }
}