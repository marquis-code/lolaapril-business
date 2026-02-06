import { ref } from 'vue'
import type { UploadAsset } from '~/types/upload'
import { upload_api } from '~/api_factory/modules'

export const useUploadImages = () => {
    const data = ref<UploadAsset[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (files: File[]) => {
        loading.value = true
        error.value = null
        try {
            const formData = new FormData()
            files.forEach(file => formData.append('files', file))
            const response = await upload_api.uploadImages(formData)
            data.value = Array.isArray(response.data)
                ? response.data
                : (response.data.data || [])
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