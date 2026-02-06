import { ref } from 'vue'
import { availability_api } from '@/api_factory/modules'

export const useGetDetailedSlots = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params: { date: string; serviceIds?: string[]; subdomain?: string; businessId?: string; staffId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const response = await availability_api.getDetailedSlots(params)
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
