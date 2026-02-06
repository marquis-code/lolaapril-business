import { ref } from 'vue'
import type { DashboardMetrics } from '~/types/growth'
import { analytics_api } from '~/api_factory/modules'

export const useFetchDashboardMetrics = () => {
    // const businessId = useCookie('businessId')
    const data = ref<DashboardMetrics | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        // if (!businessId.value) {
        //     error.value = 'Business ID is required'
        //     return null
        // }

        loading.value = true
        error.value = null
        try {
            const response = await analytics_api.getDashboardMetrics()
            data.value = response.data.data || response.data
            return data.value
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        execute
    }
}
