import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useCancelBooking = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, reason: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.cancelBooking(id, { reason })
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = execute

  return { loading, error, execute, cancelBooking }
}
