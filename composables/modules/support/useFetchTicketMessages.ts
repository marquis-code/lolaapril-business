import { ref } from 'vue'
import type { SupportMessage } from '~/types/support'
import { support_api } from '~/api_factory/modules'

export const useFetchTicketMessages = () => {
    const data = ref<SupportMessage[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (ticketId: string, includeInternal?: boolean) => {
        loading.value = true
        error.value = null
        try {
            const response = await support_api.getMessages(ticketId, { includeInternal })
            data.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
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
