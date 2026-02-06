import { ref } from 'vue'
import { reports_api } from '@/api_factory/modules'

export const useGenerateDailySalesSummary = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (date: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await reports_api.generateDailySalesSummary(date)
            data.value = response.data.data || response.data
            return data.value
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
