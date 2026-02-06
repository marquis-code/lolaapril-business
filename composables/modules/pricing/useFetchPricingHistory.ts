import { ref } from 'vue'
import type { PricingHistoryItem } from '@/types/pricing'
import { pricing_api } from '@/api_factory/modules'

export const useFetchPricingHistory = () => {
  const data = ref<PricingHistoryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.getHistory()
      data.value = Array.isArray(response.data?.data)
        ? response.data.data
        : (response.data?.data || response.data || [])
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
