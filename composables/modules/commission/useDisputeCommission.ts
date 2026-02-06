import { ref } from 'vue'
import { commission_api } from '@/api_factory/modules'

export const useDisputeCommission = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (commissionId: string, payload: { reason: string; disputedBy: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_api.disputeCommission(commissionId, payload)
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
