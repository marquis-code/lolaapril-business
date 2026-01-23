// import {
//   GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged
// } from 'firebase/auth'
// import { auth_api } from "@/api_factory/modules/auth"
// import { useUser } from "@/composables/modules/auth/user"
// import { useLoader } from "@/composables/core/useLoader"

// export const useGoogleAuth = () => {
//   const { $firebaseAuth } = useNuxtApp()
//   const config = useRuntimeConfig()
//   const { setToken, createUser } = useUser()
//   const router = useRouter()
//   const { startLoading, stopLoading } = useLoader()
// const { $auth } = useNuxtApp();


// const initializeAuthState = () => {
//     loading.value = true;
//     onAuthStateChanged($auth, (firebaseUser) => {
//       if (firebaseUser) {
//         user.value = firebaseUser;
//       } else {
//         user.value = null;
//       }
//       initialized.value = true;
//       loading.value = false;
//     });
//   };


//   onMounted(() => {
//     initializeAuthState();
//   });


//   const loginWithGoogle = async () => {
//     const provider = new GoogleAuthProvider()
//     provider.setCustomParameters({
//       prompt: 'consent'
//     })

//     const result = await signInWithPopup($firebaseAuth, provider)
//     startLoading()

//     // 🔑 Get Google ID Token
//     const idToken = await result.user.getIdToken()

//     // 🔥 Send to your backend
//     const response = await auth_api.googleAuth({idToken})
//     createUser(response.data)

//     await navigateTo('/book?subdomain=lola-beauty')

//     stopLoading()
//     return response
//   }

//   return { loginWithGoogle }
// }

import { ref, onMounted } from 'vue'
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth_api } from "@/api_factory/modules/auth"
import { useUser } from "@/composables/modules/auth/user"
import { useLoader } from "@/composables/core/useLoader"

export const useGoogleAuth = () => {
  const { $firebaseAuth } = useNuxtApp() // Changed from $auth
  const { setToken, createUser } = useUser()
  const router = useRouter()
  const { startLoading, stopLoading } = useLoader()
  
  const user = ref(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const initializeAuthState = () => {
    if (!$firebaseAuth) {
      console.error('Firebase auth is not initialized')
      initialized.value = true
      loading.value = false
      return
    }

    loading.value = true
    onAuthStateChanged($firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
      } else {
        user.value = null
      }
      initialized.value = true
      loading.value = false
    })
  }

  onMounted(() => {
    initializeAuthState()
  })

  const loginWithGoogle = async () => {
    if (!$firebaseAuth) {
      error.value = 'Firebase auth is not initialized'
      console.error('Firebase auth is not initialized')
      return
    }

    try {
      loading.value = true
      startLoading()

      // Sign out any previously signed-in users before proceeding
      await signOut($firebaseAuth)

      const provider = new GoogleAuthProvider()
      // Request explicit consent for permissions (OAuth Consent Screen)
      provider.setCustomParameters({
        prompt: 'consent'
      })

      const result = await signInWithPopup($firebaseAuth, provider)

      // 🔑 Get Google ID Token
      const idToken = await result.user.getIdToken()

      // 🔥 Send to your backend
      const response = await auth_api.googleAuth({ idToken })
      createUser(response.data)

      await navigateTo('/book?subdomain=lola-beauty')

      user.value = result.user
      
      return response
    } catch (err: any) {
      error.value = err.message
      console.error('Google login error:', err)
    } finally {
      loading.value = false
      stopLoading()
    }
  }

  return {
    user,
    error,
    loading,
    initialized,
    loginWithGoogle
  }
}