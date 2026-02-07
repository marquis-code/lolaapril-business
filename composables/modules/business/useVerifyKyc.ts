import { ref } from 'vue'
import { business_api } from '@/api_factory/modules/business.api'

export const useVerifyKyc = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (businessId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await business_api.verifyKYC(businessId)
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