import { ref } from 'vue'
import type { StaffSkill } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useUpdateStaffSkills = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (staffId: string, skills: StaffSkill[]) => {
        loading.value = true
        error.value = null
        try {
            const response = await staff_api.updateStaffSkills(staffId, skills)
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
