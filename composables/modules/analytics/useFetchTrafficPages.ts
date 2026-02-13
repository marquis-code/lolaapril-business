import useApi from '@/composables/modules/useApi'
import { ref } from 'vue'

export const useFetchTrafficPages = () => {
    const api = useApi()
    const loading = ref(false)
    const data = ref<any[]>([])

    const execute = async (startDate: string, endDate: string) => {
        loading.value = true
        try {
            const response = await api.get('/analytics/traffic/pages', {
                params: { startDate, endDate }
            }) as any
            if (response.type === 'ERROR') {
                // error ref isn't defined here, but we should handle it or throw
                return []
            }
            data.value = response.data?.data || []
            return response.data
        } catch (error) {
            console.error('Error fetching traffic analytics:', error)
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
