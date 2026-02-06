import { ref } from 'vue'
import type { CreateClientDto } from '~/types/client'
import { client_api } from '~/api_factory/modules'

export const useCreateClient = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateClientDto) => {
        loading.value = true
        error.value = null
        try {
            const response = await client_api.createClient(payload)
            data.value = response.data
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
