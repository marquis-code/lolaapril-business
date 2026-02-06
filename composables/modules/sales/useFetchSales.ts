import { ref } from 'vue'
import type { Sale } from '@/types/finance'
import { sales_api } from '@/api_factory/modules'

export const useFetchSales = () => {
  const data = ref<Sale[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: {
    clientId?: string
    appointmentId?: string
    bookingId?: string
    status?: string
    paymentStatus?: string
    staffId?: string
    startDate?: string
    endDate?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await sales_api.getSales(params)
      const rows = response.data?.data || response.data || []
      data.value = Array.isArray(rows) ? rows : []
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
