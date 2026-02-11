import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useRejectMobileSpaRequest = () => {
    const loading = ref(false)

    const rejectRequest = async (id: string, reason: string) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.reject(id, { reason })
            useNuxtApp().$toast.success('Request rejected successfully.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to reject request.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { rejectRequest, loading }
}
