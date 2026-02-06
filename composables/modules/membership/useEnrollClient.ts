import { ref } from 'vue'
import { membership_api } from '@/api_factory/modules'

export const useEnrollClient = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: {
        clientId: string
        membershipId: string
        membershipNumber: string
        joinDate: string
        expiryDate?: string
        totalPoints?: number
        totalSpent?: number
        currentTier?: string
        tierProgress?: number
        status?: string
    }) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.enrollClient(payload)
            return response.data?.data || response.data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
