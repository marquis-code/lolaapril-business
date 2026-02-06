import { ref } from 'vue'
import type { CreateStaffScheduleDto } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useCreateStaffSchedule = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateStaffScheduleDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.createSchedule(payload)
            data.value = response.data
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
