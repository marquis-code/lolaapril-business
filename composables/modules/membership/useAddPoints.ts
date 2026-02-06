import { ref } from 'vue'
import { membership_api } from '@/api_factory/modules'

export const useAddPoints = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (membershipId: string, points: number, description: string, saleId?: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.addPoints(membershipId, { points, description, saleId })
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
