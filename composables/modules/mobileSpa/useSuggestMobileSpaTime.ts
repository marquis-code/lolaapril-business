import { mobile_spa_api } from '@/api_factory/modules/mobileSpa.api'

export const useSuggestMobileSpaTime = () => {
    const loading = ref(false)

    const suggestTime = async (id: string, payload: { suggestedDate: string; suggestedTime: string; note: string }) => {
        loading.value = true
        try {
            const res = await mobile_spa_api.suggestTime(id, payload)
            useNuxtApp().$toast.success('New time suggested successfully.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to suggest new time.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { suggestTime, loading }
}
