import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useGetMobileSpaRequest = () => {
    const loading = ref(false)
    const request = ref(null)

    const getRequest = async (id: string) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.getOne(id)
            request.value = res.data.result
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to fetch request details.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { getRequest, loading, request }
}
