import { ref } from 'vue'
import { support_api } from '~/api_factory/modules'

export const useMakeSupportCall = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (ticketId: string, phoneNumber: string, agentId: string) => {
        loading.value = true
        error.value = null
        try {
            await support_api.makeCall(ticketId, { phoneNumber, agentId })
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
