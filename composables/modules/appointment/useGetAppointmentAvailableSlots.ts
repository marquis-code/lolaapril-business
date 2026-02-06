import { ref } from 'vue'
import { appointment_api } from '@/api_factory/modules'

export const useGetAppointmentAvailableSlots = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (date: string, staffId?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await appointment_api.getAvailableSlots(date, staffId)
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
