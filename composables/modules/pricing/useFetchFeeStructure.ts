import { ref } from 'vue'
import type { FeeStructure } from '@/types/pricing'
import { pricing_api } from '@/api_factory/modules'

export const useFetchFeeStructure = () => {
  const data = ref<FeeStructure | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.getFeeStructure()
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
