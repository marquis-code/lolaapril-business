import { ref } from 'vue'
import { analytics_api } from '~/api_factory/modules'

export const useGenerateFinancialReport = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: { startDate: string; endDate: string; reportPeriod?: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await analytics_api.generateFinancialReport(params)
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
