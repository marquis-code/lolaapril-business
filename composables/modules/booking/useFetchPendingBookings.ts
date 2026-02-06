import { ref } from 'vue'
import type { Booking } from '~/types/booking'
import { booking_api } from '~/api_factory/modules'

export const useFetchPendingBookings = () => {
  const data = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.getPendingBookings()
      data.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
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
