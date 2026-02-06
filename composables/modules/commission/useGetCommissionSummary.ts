import { ref } from 'vue'
import { commission_api } from '@/api_factory/modules'

export const useGetCommissionSummary = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: { startDate?: string; endDate?: string; status?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_api.getCommissionSummary(params)
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
