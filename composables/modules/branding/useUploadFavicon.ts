import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUploadFavicon = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<{ url: string; publicId: string } | null>(null)

  const execute = async (file: File) => {
    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      error.value = 'Favicon file size must be less than 500KB'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null
    try {
      const response = await branding_api.uploadFavicon(file)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload favicon'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, execute }
}
