import { ref } from 'vue'
import type { SupportMessage } from '~/types/support'
import { support_api } from '~/api_factory/modules'

export const useAddComment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (ticketId: string, messageData: SupportMessage) => {
        loading.value = true
        error.value = null
        try {
            await support_api.addMessage(ticketId, messageData)
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
