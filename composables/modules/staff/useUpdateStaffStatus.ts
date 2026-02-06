import { ref } from 'vue'
import { staff_api } from '~/api_factory/modules'

export const useUpdateStaffStatus = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (staffId: string, status: string, reason?: string) => {
        loading.value = true
        error.value = null
        try {
            await staff_api.updateStaffStatus(staffId, status, reason)
            return true
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
