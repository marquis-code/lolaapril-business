import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUpdateWidget = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (widgetId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.updateWidget(widgetId, payload)
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
