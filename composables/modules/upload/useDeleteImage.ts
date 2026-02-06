import { ref } from 'vue'
import { upload_api } from '~/api_factory/modules'

export const useDeleteImage = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (publicId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await upload_api.deleteImage(publicId)
            return response.data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}