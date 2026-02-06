import { ref } from 'vue'
import { client_api } from '@/api_factory/modules'

export const useEnableGrokCodeFast1 = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await client_api.enableGrokCodeFast1()
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
