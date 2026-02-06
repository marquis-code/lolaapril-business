import { ref } from 'vue'
import type { CommissionBreakdown } from '~/types/growth'
import { analytics_api } from '~/api_factory/modules'

export const useFetchCommissionBreakdown = () => {
    const businessId = useCookie('businessId')
    const data = ref<CommissionBreakdown | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (startDate: string, endDate: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await analytics_api.getCommissionBreakdown({
                startDate,
                endDate
            })
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
