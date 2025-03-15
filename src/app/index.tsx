import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';

import ThemedView from '@/src/components/ThemedView';
import LoadingIndicator from '../components/LoadingIndicator';

import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  // set the session state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // navigate to home or auth depending on session state
  useEffect(() => {
    if (session && session.user) {
      router.navigate('/(tabs)/home');
    } else if (session && !session.user) {
      router.navigate('/Auth')
    }
  }, [session])

  return (
    <ThemedView>
        <LoadingIndicator />
    </ThemedView>
);
}