import { ref } from 'vue'
import type { ClientMembership } from '~/types/growth'
import { membership_api } from '@/api_factory/modules'

export const useFetchClientMemberships = () => {
    const data = ref<ClientMembership[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (clientId: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await membership_api.getClientMemberships(clientId)
            data.value = Array.isArray(response.data?.data)
                ? response.data.data
                : (response.data?.data || response.data || [])
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
