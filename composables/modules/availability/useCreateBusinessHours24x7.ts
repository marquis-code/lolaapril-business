import { ref } from 'vue'
import { availability_api } from '@/api_factory/modules'

export const useCreateBusinessHours24x7 = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await availability_api.createBusinessHours24x7()
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
