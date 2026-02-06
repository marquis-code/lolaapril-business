import { ref } from 'vue'
import { marketplace_api } from '@/api_factory/modules'

export const useMarketplaceReviews = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (businessId: string, params?: { page?: number; limit?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await marketplace_api.getBusinessReviews(businessId, params)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
