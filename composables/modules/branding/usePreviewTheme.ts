import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const usePreviewTheme = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Create preview session and return previewId
  const execute = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.createPreviewSession(payload)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to create preview session'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Fetch preview theme data (public endpoint)
  const fetchPreview = async (previewId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.getPreviewTheme(previewId)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to fetch preview'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute, fetchPreview }
}
