import { ref } from 'vue'
import type { UploadAsset } from '~/types/upload'
import { upload_api } from '~/api_factory/modules'

export const useUploadImage = () => {
    const data = ref<UploadAsset | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (file: File) => {
        loading.value = true
        error.value = null
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await upload_api.uploadImage(formData)
            data.value = response.data.data || response.data
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