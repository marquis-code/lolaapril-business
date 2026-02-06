import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useConfirmBooking = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (id: string, payload: { staffId?: string; staffAssignments?: any[] }) => {
    loading.value = true
    error.value = null
    try {
      const response = await booking_api.confirmBooking(id, payload)
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
