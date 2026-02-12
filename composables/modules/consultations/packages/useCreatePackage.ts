import { consultations_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreatePackage = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const createPackage = async (payload: { name: string; description: string; price: number; duration: number }) => {
        loading.value = true
        try {
            const res = await consultations_api.createPackage(payload)
            showToast({
                title: 'Success',
                message: 'Package created successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to create package.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { createPackage, loading }
}
