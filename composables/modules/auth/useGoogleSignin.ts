// import { ref } from "vue"
// import { auth_api } from "@/api_factory/modules/auth"
// import { useLoader } from "@/composables/core/useLoader"
// import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

// export const useGoogleSignin = () => {
//     const loading = ref(false)
//     const { startLoading, stopLoading } = useLoader()

//  const signInWithGoogle = async () => {
//   try {
//     // Get your backend URL from environment or config
//     // const backendUrl = 'https://af9e16900bbd.ngrok-free.app' // or use env variable
    
//     // Optional: Add subdomain if needed
//     const subdomain = 'lola-beauty' // or get from route/props
    
//     // Redirect to backend Google OAuth endpoint
//     const redirectUrl = subdomain 
//       ? `${GATEWAY_ENDPOINT}/auth/google?subdomain=${subdomain}`
//       : `${GATEWAY_ENDPOINT}/auth/google`
    
//     window.location.href = redirectUrl
//   } catch (error) {
//     console.error('Google authentication error:', error)
//   }
// }


//     return {
//         loading,
//         signInWithGoogle
//     }
// }


import {
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

export const useGoogleSignin = () => {
  const { $firebaseAuth } = useNuxtApp()
  const loading = ref(false)

  const signInWithGoogle = async () => {
    loading.value = true

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      // 1. Google popup
      const result = await signInWithPopup($firebaseAuth, provider)

      // 2. Firebase ID token
      const idToken = await result.user.getIdToken()

      // 3. Send token to NestJS
      const response = await $fetch('/api/auth/google', {
        method: 'POST',
        body: { idToken }
      })

      return response
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    signInWithGoogle
  }
}
