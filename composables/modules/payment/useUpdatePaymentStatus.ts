import { ref } from 'vue'
import { payment_api } from '@/api_factory/modules'

export const useUpdatePaymentStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { status: string; transactionId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_api.updateStatus(id, payload)
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
