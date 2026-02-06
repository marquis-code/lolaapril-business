import { ref } from 'vue'
import { sales_api } from '@/api_factory/modules'

export const useFetchRevenueByPeriod = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (period: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.getRevenueByPeriod(period)
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
