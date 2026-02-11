import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useCompleteMobileSpaRequest = () => {
    const loading = ref(false)

    const completeRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.complete(id)
            useNuxtApp().$toast.success('Request marked as completed.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to complete request.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { completeRequest, loading }
}
