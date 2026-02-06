import { ref } from 'vue'
import { membership_api } from '@/api_factory/modules'

export const useRedeemPoints = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (membershipId: string, points: number, description: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.redeemPoints(membershipId, { points, description })
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
