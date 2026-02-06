import { ref } from 'vue'
import { appointment_api } from '@/api_factory/modules'

export const useGetAppointments = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: Record<string, any>) => {
    loading.value = true
    error.value = null
    try {
      const response = await appointment_api.findAll(params)
      console.log('Get Appointments Response:', response)
      data.value = response?.data?.appointments
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
