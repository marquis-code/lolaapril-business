import { ref } from 'vue'
import { reports_api } from '@/api_factory/modules'

export const useFetchWeeklySalesReport = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (startDate: string, endDate: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await reports_api.getWeeklySalesReport({ startDate, endDate })
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
