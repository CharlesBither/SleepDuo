import { useState, useEffect } from 'react'
import { useRouter, Redirect } from 'expo-router';

// import ThemedView from '@/src/app/components/ThemedView';
// import LoadingIndicator from './components/LoadingIndicator';
import Home from './(tabs)/home';
import Auth from './components/pages/Auth/Auth';

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
      // console.log(session)
      setSession(session)
    })
  }, [])
  
  return session && session.user ? <Redirect href="/(tabs)/home" /> : <Auth />
}