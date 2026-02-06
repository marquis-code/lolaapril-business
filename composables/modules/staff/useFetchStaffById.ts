import { ref } from 'vue'
import type { Staff } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useFetchStaffById = () => {
    const data = ref<Staff | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (staffId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.getStaffById(staffId)
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
