import { review_api } from '@/api_factory/modules/review.api'

export const useGetBusinessReviews = () => {
    const loading = ref(false)
    const reviews = ref([])

    const getReviews = async (businessId: string) => {
        loading.value = true
        try {
            const res = await review_api.getBusinessReviews(businessId)
            reviews.value = res.data.result || []
            return res
        } catch (error: any) {
            useNuxtApp().$toast.error((error as any).message || 'Failed to fetch reviews.', {
                autoClose: 2000,
            })
        } finally {
            loading.value = false
        }
    }

    return { getReviews, loading, reviews }
}
