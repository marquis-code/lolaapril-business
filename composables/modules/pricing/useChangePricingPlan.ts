import { ref } from 'vue'
import { pricing_api } from '@/api_factory/modules'

export const useChangePricingPlan = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (payload: { newTierId: string; changedBy: string; reason: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.changePlan(payload)
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
