import { ref } from 'vue'
import { branding_api } from '@/api_factory/modules'

export const useUploadEmailHeader = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<{ url: string; publicId: string; width: number; height: number } | null>(null)

  const execute = async (file: File) => {
    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      error.value = 'Email header file size must be less than 1MB'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null
    try {
      const response = await branding_api.uploadEmailHeader(file)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message || 'Failed to upload email header'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, execute }
}
