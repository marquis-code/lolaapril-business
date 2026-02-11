import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDuplicateCampaign = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const duplicateCampaign = async (id: string) => {
        loading.value = true
        try {
            const res = await campaign_api.duplicate(id)
            showToast({
                title: 'Success',
                message: 'Campaign duplicated successfully.',
                type: 'success',
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to duplicate campaign.',
                type: 'error',
            })
        } finally {
            loading.value = false
        }
    }

    return { duplicateCampaign, loading }
}
