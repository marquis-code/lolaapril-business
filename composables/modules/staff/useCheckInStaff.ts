import { ref } from 'vue'
import type { CheckInStaffDto } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useCheckInStaff = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CheckInStaffDto) => {
        loading.value = true
        error.value = null
        try {
            await staff_api.checkInStaff(payload)
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
