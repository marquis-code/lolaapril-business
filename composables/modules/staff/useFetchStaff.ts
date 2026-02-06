import { ref } from 'vue'
import type { Staff } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useFetchStaff = () => {
    const data = ref<Staff[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (status: string = 'active') => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.getStaff({ status })
            data.value = response.data.data || []
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
