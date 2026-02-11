import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDeleteCampaign = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deleteCampaign = async (id: string) => {
        loading.value = true
        try {
            await campaign_api.delete(id)
            showToast({
                title: 'Success',
                message: 'Campaign deleted successfully.',
                type: 'success',
            })
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to delete campaign.',
                type: 'error',
            })
        } finally {
            loading.value = false
        }
    }

    return { deleteCampaign, loading }
}
