import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'
import ForgotPassword from '~/pages/auth/forgot-password.vue'

export const useForgotPassword = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const forgotPassword = async ({email}: {email: string}) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      await auth_api.forgotPassword(email)
      navigateTo(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
      success.value = true
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, success, forgotPassword }
}
