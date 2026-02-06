import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useVerifyResetOTP = () => {
  const valid = ref<boolean | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const verifyResetOTP = async (email: string, otp: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.verifyResetOTP({ email, otp })
      valid.value = res.data?.valid ?? false
       navigateTo(`/auth/reset-password?token=${res.data.resetToken}`)
      return valid.value
    } catch (e: any) {
      error.value = e.message
      valid.value = false
      throw e
    } finally {
      loading.value = false
    }
  }

  return { valid, loading, error, verifyResetOTP }
}
