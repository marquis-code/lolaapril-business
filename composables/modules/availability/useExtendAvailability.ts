import { ref } from 'vue'
import { availability_api } from '@/api_factory/modules'

export const useExtendAvailability = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (payload: { staffId?: string; daysAhead?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await availability_api.extendAvailability(payload)
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
