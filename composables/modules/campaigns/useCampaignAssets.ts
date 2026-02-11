import { campaign_api } from '@/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCampaignAssets = () => {
    const loading = ref(false)
    const assets = ref<any[]>([])
    const { showToast } = useCustomToast()

    const fetchAssets = async () => {
        loading.value = true
        try {
            const res = await campaign_api.fetch_assets()
            assets.value = res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to fetch assets.',
                type: 'error',
            })
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchAssets()
    })

    return { assets, loading, fetchAssets }
}
