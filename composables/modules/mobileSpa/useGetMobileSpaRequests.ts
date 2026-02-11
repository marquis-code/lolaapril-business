import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useGetMobileSpaRequests = () => {
    const loading = ref(false)
    const requests = ref([])

    const getRequests = async (params?: { status?: string; page?: number; limit?: number }) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.getAll(params)
            console.log('Fetched requests:', res.data)
            requests.value = res.data.data.requests || []
            return requests
        } catch (error: any) {
            // useNuxtApp().$toast.error((error as any).message || 'Failed to fetch requests.', {
            //     autoClose: 2000,
            // })
        } finally {
            loading.value = false
        }
    }

    return { getRequests, loading, requests }
}
