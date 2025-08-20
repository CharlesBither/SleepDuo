import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/src/lib/supabase'
import { initJournalRecordsMap } from '@/src/database/journal_records'
import { getId } from '@/src/database/auth'

export default function () {
  GoogleSignin.configure({
    webClientId: '64191911837-s609cbkdsj4p0f64sdsov1nbeik95p1h.apps.googleusercontent.com',
  })

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          if (!userInfo.data || !userInfo.data.user.id) {
            throw new Error("userInfo.data.user.id is null");
          }
          if (userInfo.data.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.data.idToken,
            })
            console.log(error, data);
          } else {
            throw new Error('no ID token present!');
          }

          // initialize the journalRecordsMap
          const uuid = await getId();
          await initJournalRecordsMap(uuid);
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.error('user cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.error('login in process already');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.error('play services not available or outdated');
          } else {
            // some other error happened
            console.error('could not sign in');
            console.error(error);
          }
        }
      }}
    />
  )
}