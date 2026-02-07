import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useGetTheme = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getTheme()
      console.log('Fetched theme response:', response)
      data.value = response.data
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
