import { ref } from 'vue'
import { appointment_api } from '@/api_factory/modules'

export const useDeleteAppointment = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await appointment_api.remove(id)
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
