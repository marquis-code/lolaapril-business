import { consultations_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useConfirmBooking = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const confirmBooking = async (id: string) => {
        loading.value = true
        try {
            const res = await consultations_api.confirmBooking(id)
            showToast({
                title: 'Success',
                message: 'Booking confirmed successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to confirm booking.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { confirmBooking, loading }
}
