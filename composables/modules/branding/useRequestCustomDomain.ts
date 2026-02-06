import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useRequestCustomDomain = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (domain: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.requestCustomDomain({ domain })
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
