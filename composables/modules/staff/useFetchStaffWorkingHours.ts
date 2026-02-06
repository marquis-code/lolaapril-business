import { ref } from 'vue'
import { staff_api } from '~/api_factory/modules'

export const useFetchStaffWorkingHours = () => {
    const data = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (staffId: string, params: { startDate: string; endDate: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.getWorkingHours(staffId, params)
            data.value = response.data.data || response.data || []
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
