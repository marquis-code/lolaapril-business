import { ref } from 'vue'
import type { KycDocumentType, KycUploadResponse } from '~/types/upload'
import { upload_api } from '~/api_factory/modules'

export const useUploadKycDocument = () => {
    const data = ref<KycUploadResponse | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: { file: File; businessId: string; documentType: KycDocumentType }) => {
        loading.value = true
        error.value = null
        try {
            const formData = new FormData()
            formData.append('file', payload.file)
            formData.append('businessId', payload.businessId)
            formData.append('documentType', payload.documentType)

            const response = await upload_api.uploadKycDocument(formData)
            data.value = response.data
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