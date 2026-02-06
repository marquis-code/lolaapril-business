import { ref } from 'vue'
import { sales_api } from '@/api_factory/modules'

export const useUpdateSaleStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, status: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.updateStatus(id, { status })
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
