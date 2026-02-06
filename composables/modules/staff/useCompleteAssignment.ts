import { ref } from 'vue'
import type { CompleteAssignmentDto } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useCompleteAssignment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (assignmentId: string, payload: CompleteAssignmentDto) => {
        loading.value = true
        error.value = null
        try {
            await staff_api.completeAssignment(assignmentId, payload)
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
