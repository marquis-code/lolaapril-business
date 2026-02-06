import { ref } from 'vue'
import type { StaffSchedule } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useFetchStaffSchedule = () => {
    const data = ref<StaffSchedule | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (staffId: string, date?: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.getSchedule(staffId, date ? { date } : undefined)
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
