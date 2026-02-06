import { ref } from 'vue'
import { support_api } from '~/api_factory/modules'

export const useAssignTicket = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (ticketId: string, agentId: string) => {
        loading.value = true
        error.value = null
        try {
            await support_api.assignTicket(ticketId, agentId)
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
