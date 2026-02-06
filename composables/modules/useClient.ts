import type { Client, CreateClientDto } from '~/types/client'
import { client_api } from '~/api_factory/modules'

export const useClient = () => {
    const businessId = useCookie('businessId')

    const clients = ref<Client[]>([])
    const currentClient = ref<Client | null>(null)
    const stats = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchClients = async (params: { page?: number, limit?: number, search?: string } = {}) => {
        loading.value = true
        try {
            const { data } = await client_api.getClients({
                businessId: businessId.value!,
                ...params
            })
            clients.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchClientById = async (id: string) => {
        loading.value = true
        try {
            const { data } = await client_api.getClientById(id)
            currentClient.value = data.data || data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const createClient = async (payload: CreateClientDto) => {
        loading.value = true
        try {
            const { data } = await client_api.createClient(payload)
            await fetchClients()
            return data
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const fetchStats = async () => {
        try {
            const { data } = await client_api.getStats(businessId.value!)
            stats.value = data
        } catch (e: any) {
            console.error(e)
        }
    }

    return {
        clients,
        currentClient,
        stats,
        loading,
        error,
        fetchClients,
        fetchClientById,
        createClient,
        fetchStats
    }
}
