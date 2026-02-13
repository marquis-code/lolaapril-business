import { analytics_api } from '@/api_factory/modules/analytics.api'
import { ref } from 'vue'

export const useFetchTrafficDetails = () => {
    const loading = ref(false)
    const data = ref<any[]>([])

    const execute = async (startDate: string, endDate: string) => {
        loading.value = true
        try {
            const response = await (analytics_api as any).getTrafficDetails({ startDate, endDate })

            if ([200, 201].includes(response.status)) {
                data.value = response.data?.data || []
                return response.data
            }
            return []
        } catch (error) {
            console.error('Error fetching traffic details:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        data,
        execute
    }
}
