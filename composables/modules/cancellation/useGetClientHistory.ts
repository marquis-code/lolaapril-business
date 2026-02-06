import { ref } from 'vue'
import { cancellation_api } from '@/api_factory/modules'

export const useGetClientHistory = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (clientId: string, limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await cancellation_api.getClientHistory(clientId, limit)
      data.value = response.data?.data || response.data || []
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
