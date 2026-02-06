import { ref } from 'vue'
import type { CreateStaffDto } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useCreateStaff = () => {
    const businessId = useCookie('businessId')
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateStaffDto) => {
        if (!payload.businessId && businessId.value) {
            payload.businessId = businessId.value
        }

        loading.value = true
        error.value = null
        try {
            const response = await staff_api.createStaff(payload)
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
