import { consultations_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCompleteBooking = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const completeBooking = async (id: string) => {
        loading.value = true
        try {
            const res = await consultations_api.markAsCompleted(id)
            showToast({
                title: 'Success',
                message: 'Booking marked as completed.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to complete booking.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { completeBooking, loading }
}
