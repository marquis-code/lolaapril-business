import { ref } from 'vue'
import { support_api } from '~/api_factory/modules'
import type { SupportTicket } from '~/types/support'

export const useFetchTicketById = () => {
    const data = ref<SupportTicket | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await support_api.getTicketById(id)
            data.value = response.data.data || response.data
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
