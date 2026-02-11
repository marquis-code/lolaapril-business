import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useAcceptMobileSpaRequest = () => {
    const loading = ref(false)

    const acceptRequest = async (id: string, payload?: { paymentLink?: string }) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.accept(id, payload)
            useNuxtApp().$toast.success('Request accepted successfully.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to accept request.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { acceptRequest, loading }
}
