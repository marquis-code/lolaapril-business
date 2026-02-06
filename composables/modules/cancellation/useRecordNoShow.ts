import { ref } from 'vue'
import { cancellation_api } from '@/api_factory/modules'

export const useRecordNoShow = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (appointmentId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await cancellation_api.recordNoShow(appointmentId, payload)
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
