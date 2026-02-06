import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useCreateWidget = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.createWidget(payload)
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
