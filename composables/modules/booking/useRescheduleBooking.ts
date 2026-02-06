import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useRescheduleBooking = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { newPreferredDate: string; newPreferredStartTime: string; reason: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.rescheduleBooking(id, payload)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const rescheduleBooking = execute

  return { loading, error, execute, rescheduleBooking }
}
