import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreateCampaign = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const createCampaign = async (payload: any) => {
        loading.value = true
        try {
            const res = await campaign_api.create(payload)
            showToast({
                title: 'Success',
                message: 'Campaign created successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to create campaign.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { createCampaign, loading }
}
