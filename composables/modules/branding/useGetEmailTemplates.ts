import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useGetEmailTemplates = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getEmailTemplates()
      data.value = response.data?.data || response.data || []
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
