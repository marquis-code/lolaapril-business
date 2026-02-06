import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const upload_api = {
    uploadImage: (payload: FormData) => {
        const url = '/upload/image'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    uploadImages: (payload: FormData) => {
        const url = '/upload/images'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    uploadDocument: (payload: FormData) => {
        const url = '/upload/document'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    uploadKycDocument: (payload: FormData) => {
        const url = '/upload/kyc-document'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    deleteImage: (publicId: string) => {
        const url = `/upload/image/${publicId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    }
}