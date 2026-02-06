import { ref } from 'vue'
import type { CreateTicketDto } from '~/types/support'
import { support_api } from '~/api_factory/modules'

export const useCreateTicket = () => {
    const businessId = useCookie('businessId')
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateTicketDto) => {
        loading.value = true
        error.value = null
        try {
            const finalPayload = {
                ...payload,
                businessId: payload.businessId || businessId.value
            }
            await support_api.createTicket(finalPayload)
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
