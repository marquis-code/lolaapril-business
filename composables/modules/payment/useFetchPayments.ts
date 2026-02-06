import { ref } from 'vue'
import type { Payment } from '@/types/finance'
import { payment_api } from '@/api_factory/modules'

export const useFetchPayments = () => {
  const data = ref<Payment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: {
    clientId?: string
    appointmentId?: string
    bookingId?: string
    status?: string
    paymentMethod?: string
    startDate?: string
    endDate?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_api.getPayments(params)
      console.log('Fetch Payments Response:', response)
      data.value = response.data?.data
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
