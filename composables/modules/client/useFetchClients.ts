import { ref } from 'vue'
import type { Client } from '~/types/client'
import { client_api } from '~/api_factory/modules'

export const useFetchClients = () => {
    const data = ref<Client[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: { page?: number, limit?: number, search?: string } = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await client_api.getClients({ ...params })
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
