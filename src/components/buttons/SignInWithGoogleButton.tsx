import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/src/lib/supabase'
import { setErrorMsg } from '@/src/stores/error'
import { useRouter } from 'expo-router'

export default function () {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  })

  const router = useRouter();

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
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            setErrorMsg('user cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            setErrorMsg('login in process already');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            setErrorMsg('play services not available or outdated');
          } else {
            // some other error happened
            setErrorMsg('GoogleSignIn threw error: ' + error);
          }
          router.replace("/ErrorScreen");
        }
      }}
    />
  )
}