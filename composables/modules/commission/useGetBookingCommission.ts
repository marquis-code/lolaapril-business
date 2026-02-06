import { ref } from 'vue'
import { commission_api } from '@/api_factory/modules'

export const useGetBookingCommission = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (bookingId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await commission_api.getBookingCommission(bookingId)
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
