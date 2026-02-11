import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdateCampaign = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const updateCampaign = async (id: string, payload: any) => {
        loading.value = true
        try {
            const res = await campaign_api.update(id, payload)
            showToast({
                title: 'Success',
                message: 'Campaign updated successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update campaign.',
                type: 'error',
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { updateCampaign, loading }
}
