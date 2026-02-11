import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useListCampaigns = () => {
    const loading = ref(false)
    const campaigns = ref<any[]>([])
    const { showToast } = useCustomToast()

    const fetchCampaigns = async () => {
        loading.value = true
        try {
            const res = await campaign_api.fetch_campaigns()
            campaigns.value = res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to fetch campaigns.',
                type: 'error',
            })
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchCampaigns()
    })

    return { campaigns, loading, fetchCampaigns }
}
