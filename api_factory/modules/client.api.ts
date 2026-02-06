import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateClientDto } from '~/types/client'

export const client_api = {
    getClients: (params: { page?: number, limit?: number, search?: string } = {}) => {
        const url = "/clients"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getClientById: (id: string) => {
        const url = `/clients/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createClient: (payload: CreateClientDto) => {
        const url = "/clients"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateClient: (id: string, payload: any) => {
        const url = `/clients/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    removeClient: (id: string) => {
        const url = `/clients/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    getStats: () => {
        const url = "/clients/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    enableGrokCodeFast1: () => {
        const url = '/clients/enable-grok-code-fast-1'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    exportCSV: () => {
        const url = '/clients/export/csv'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { responseType: 'blob' })
    },

    exportPDF: () => {
        const url = '/clients/export/pdf'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { responseType: 'blob' })
    },

    importCSV: (file: File) => {
        const url = '/clients/import/csv'
        const formData = new FormData()
        formData.append('file', file)
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}
