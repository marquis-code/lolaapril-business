import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCampaignDetails = () => {
    const loading = ref(false)
    const campaign = ref<any>(null)
    const { showToast } = useCustomToast()

    const getCampaignDetails = async (id: string) => {
        loading.value = true
        try {
            const res = await campaign_api.fetch_campaign_details(id)
            campaign.value = res.data
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to fetch campaign details.',
                type: 'error',
            })
        } finally {
            loading.value = false
        }
    }

    return { campaign, loading, getCampaignDetails }
}
