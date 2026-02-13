import { ref } from 'vue'
import { booking_api } from '@/api_factory/modules'

export const useGetCancellations = () => {
    const data = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await booking_api.getCancellations()
            data.value = response?.data?.data || response?.data || []
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
