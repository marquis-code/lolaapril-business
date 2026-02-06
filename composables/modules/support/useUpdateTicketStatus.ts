import { ref } from 'vue'
import { support_api } from '~/api_factory/modules'

export const useUpdateTicketStatus = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string, status: string, userId: string) => {
        loading.value = true
        error.value = null
        try {
            await support_api.updateTicketStatus(id, { status, userId })
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
