import { ref } from 'vue'
import { sales_api } from '@/api_factory/modules'

export const useUpdateSalePaymentStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { paymentStatus: string; amountPaid?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.updatePaymentStatus(id, payload)
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
