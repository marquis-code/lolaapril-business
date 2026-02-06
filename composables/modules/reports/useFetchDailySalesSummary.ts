import { ref } from 'vue'
import type { DailySalesSummary } from '@/types/settings'
import { reports_api } from '@/api_factory/modules'

export const useFetchDailySalesSummary = () => {
    const data = ref<DailySalesSummary | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (date: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await reports_api.getDailySalesSummary(date)
            data.value = response.data.data || response.data
            return data.value
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
