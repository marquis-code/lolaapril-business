import { consultations_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdatePackage = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const updatePackage = async (id: string, payload: { name?: string; description?: string; price?: number; duration?: number; isActive?: boolean }) => {
        loading.value = true
        try {
            const res = await consultations_api.updatePackage(id, payload)
            showToast({
                title: 'Success',
                message: 'Package updated successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update package.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { updatePackage, loading }
}
