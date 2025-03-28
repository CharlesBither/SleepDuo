import { useState, useEffect } from 'react'
import { useRouter, Redirect } from 'expo-router';

import Auth from './components/pages/Auth/Auth';
import ThemedView from './components/ThemedView';
import LoadingIndicator from './components/LoadingIndicator';

import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

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
    return <ThemedView><LoadingIndicator /></ThemedView>
  } else {
    return session && session.user ? <Redirect href="/(tabs)/home" /> : <ThemedView><Auth /></ThemedView>
  }
}