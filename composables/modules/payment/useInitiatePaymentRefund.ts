import { ref } from 'vue'
import { payment_api } from '@/api_factory/modules'

export const useInitiatePaymentRefund = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (reference: string, amount?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_api.initiateRefund(reference, amount ? { amount } : undefined)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
