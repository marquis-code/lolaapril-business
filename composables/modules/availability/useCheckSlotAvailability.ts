import { ref } from 'vue'
import { availability_api } from '@/api_factory/modules'

export const useCheckSlotAvailability = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params: { businessId: string; date: string; startTime: string; duration: number; staffId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await availability_api.checkSlotAvailability(params)
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
