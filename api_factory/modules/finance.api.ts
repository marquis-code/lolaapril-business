import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateSaleDto } from '~/types/finance'

export const finance_api = {
    getSales: (businessId: string) => {
        const url = "/sales"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: { businessId } })
    },

    getPayments: (businessId: string) => {
        const url = "/payments"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: { businessId } })
    },

    createSale: (payload: CreateSaleDto) => {
        const url = "/sales"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getSalesStats: () => {
        const url = "/sales/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getPaymentsStats: () => {
        const url = "/payments/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
