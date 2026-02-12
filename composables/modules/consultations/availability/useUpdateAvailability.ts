import { consultations_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdateAvailability = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const updateAvailability = async (payload: { weeklySchedule: any[] }) => {
        loading.value = true
        try {
            const res = await consultations_api.updateWeeklySchedule(payload)
            showToast({
                title: 'Success',
                message: 'Availability updated successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update availability.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { updateAvailability, loading }
}
