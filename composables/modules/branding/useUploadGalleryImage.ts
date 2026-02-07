import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUploadGalleryImage = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (file: File) => {
    loading.value = true
    error.value = null
    try {
      const response = await branding_api.uploadGalleryImage(file)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload gallery image'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Upload multiple gallery images
  const executeMultiple = async (files: File[]) => {
    loading.value = true
    error.value = null
    const results: any[] = []
    try {
      for (const file of files) {
        const response = await branding_api.uploadGalleryImage(file)
        results.push(response.data?.data || response.data)
      }
      data.value = results
      return results
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload gallery images'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute, executeMultiple }
}
