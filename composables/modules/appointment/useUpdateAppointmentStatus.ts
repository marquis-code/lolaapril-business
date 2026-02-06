import { ref } from 'vue'
import { appointment_api } from '@/api_factory/modules'

export const useUpdateAppointmentStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { status: string; cancellationReason?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await appointment_api.updateStatus(id, payload)
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
