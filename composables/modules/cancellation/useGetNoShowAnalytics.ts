import { ref } from 'vue'
import { cancellation_api } from '@/api_factory/modules'

export const useGetNoShowAnalytics = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: { startDate?: string; endDate?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await cancellation_api.getNoShowAnalytics(params)
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
