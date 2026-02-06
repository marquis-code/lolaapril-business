import { ref } from 'vue'
import { marketplace_api } from '@/api_factory/modules'

export const useMarketplaceVerificationStatus = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (tenantId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await marketplace_api.getVerificationStatus(tenantId)
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
