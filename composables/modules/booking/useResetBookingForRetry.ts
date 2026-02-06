import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useResetBookingForRetry = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.resetBookingForRetry(id)
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
