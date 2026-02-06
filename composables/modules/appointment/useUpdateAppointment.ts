import { ref } from 'vue'
import { appointment_api } from '@/api_factory/modules'

export const useUpdateAppointment = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await appointment_api.update(id, payload)
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
