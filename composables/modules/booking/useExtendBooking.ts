import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useExtendBooking = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, additionalMinutes?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.extendBooking(id, additionalMinutes ? { additionalMinutes } : undefined)
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
