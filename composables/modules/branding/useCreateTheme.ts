import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useCreateTheme = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<any>(null)

  const execute = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.createOrUpdateTheme(payload)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to create theme'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, execute }
}
