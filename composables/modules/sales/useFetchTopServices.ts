import { ref } from 'vue'
import { sales_api } from '@/api_factory/modules'

export const useFetchTopServices = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.getTopServices()
      const rows = response.data?.data || response.data || []
      data.value = Array.isArray(rows) ? rows : []
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
