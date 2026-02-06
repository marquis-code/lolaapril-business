import { ref } from 'vue'
import { booking_api } from '~/api_factory/modules'

export const useFetchBookingStats = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params?: { startDate?: string; endDate?: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await booking_api.getStats(params)
            data.value = response.data?.data || response.data
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
