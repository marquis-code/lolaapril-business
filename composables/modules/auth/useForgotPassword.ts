import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'
import ForgotPassword from '~/pages/auth/forgot-password.vue'

export const useForgotPassword = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const { showToast } = useCustomToast()

  const forgotPassword = async ({email}: {email: string}) => {
    loading.value = true
    error.value = null
    success.value = false
          const res = await auth_api.forgotPassword(email)
          console.log('Forgot password response:', res)
          if([200, 201].includes(res.status)) {
            showToast({ title: 'Success', message: res.data.message, toastType: 'success' })
            navigateTo(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
            success.value = true
          } else {
            const errorMessage = res.data?.message || 'Failed to send OTP'
            error.value = errorMessage
            showToast({ title: 'Error', message: errorMessage, toastType: 'error' })
            throw new Error(errorMessage)
          }
  }

  return { loading, error, success, forgotPassword }
}
