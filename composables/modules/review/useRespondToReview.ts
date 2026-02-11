import { review_api } from '@/api_factory/modules/review.api'

export const useRespondToReview = () => {
    const loading = ref(false)

    const respondToReview = async (id: string, response: string) => {
        loading.value = true
        try {
            const res = await review_api.respond(id, { response })
            useNuxtApp().$toast.success('Response posted successfully.', {
                autoClose: 2000,
            })
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to post response.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { respondToReview, loading }
}
