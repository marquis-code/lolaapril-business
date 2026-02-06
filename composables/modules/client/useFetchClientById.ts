import { ref } from 'vue'
import type { Client } from '~/types/client'
import { client_api } from '~/api_factory/modules'

export const useFetchClientById = () => {
    const data = ref<Client | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await client_api.getClientById(id)
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
