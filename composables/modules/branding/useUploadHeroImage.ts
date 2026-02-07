import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUploadHeroImage = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (file: File) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.uploadHeroImage(file)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload hero image'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
