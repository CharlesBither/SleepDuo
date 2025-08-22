import { useState, useEffect } from 'react'
import { Redirect } from 'expo-router';

import Auth from './Auth';
import ThemedView from '../components/ThemedView';

import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { initJournalRecordsMap } from '../database/journal_records';
import LoadingScreen from './LoadingScreen';

// register en locale for react-native-paper-dates
require('@formatjs/intl-getcanonicallocales/polyfill')
require('@formatjs/intl-locale/polyfill')

require('@formatjs/intl-pluralrules/polyfill')
require('@formatjs/intl-pluralrules/locale-data/en.js')

require('@formatjs/intl-displaynames/polyfill')
require('@formatjs/intl-displaynames/locale-data/en.js')

require('@formatjs/intl-listformat/polyfill')
require('@formatjs/intl-listformat/locale-data/en.js')

require('@formatjs/intl-numberformat/polyfill')
require('@formatjs/intl-numberformat/locale-data/en.js')

require('@formatjs/intl-relativetimeformat/polyfill')
require('@formatjs/intl-relativetimeformat/locale-data/en.js')

require('@formatjs/intl-datetimeformat/polyfill')
require('@formatjs/intl-datetimeformat/locale-data/en.js')

require('@formatjs/intl-datetimeformat/add-golden-tz.js')

import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    if (session && session.user) {
      // initJournalRecordsMap(session.user.id)
      //   .then(() => console.log("initialized journalRecordsMap"))
      //   .catch(() => console.error("error initializing journalRecordsMap"));
    }
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