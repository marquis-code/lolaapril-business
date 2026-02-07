import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUploadLogo = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<{ url: string; publicId: string; width: number; height: number } | null>(null)

  const execute = async (file: File) => {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Logo file size must be less than 2MB'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null
    try {
      const response = await branding_api.uploadLogo(file)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload logo'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, execute }
}
