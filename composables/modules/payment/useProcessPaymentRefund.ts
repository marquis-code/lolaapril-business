import { ref } from 'vue'
import { payment_api } from '@/api_factory/modules'

export const useProcessPaymentRefund = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { refundAmount: number; refundReason: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_api.processRefund(id, payload)
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
