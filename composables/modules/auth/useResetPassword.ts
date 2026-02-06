import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useResetPassword = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const resetPassword = async (payload: {
    email: string
    otp: string
    newPassword: string
  }) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      await auth_api.resetPassword(payload)
      await navigateTo('/auth/login?reset=success')
      success.value = true
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, success, resetPassword }
}
