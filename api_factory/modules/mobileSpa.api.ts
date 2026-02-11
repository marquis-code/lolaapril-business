import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const mobile_spa_api = {
    getAll: (params?: { status?: string; page?: number; limit?: number }) => {
        const url = '/mobile-spa/business'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getOne: (id: string) => {
        const url = `/mobile-spa/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    accept: (id: string, payload?: { paymentLink?: string }) => {
        const url = `/mobile-spa/${id}/accept`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload || {})
    },

    reject: (id: string, payload: { reason: string }) => {
        const url = `/mobile-spa/${id}/reject`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    suggestTime: (id: string, payload: { suggestedDate: string; suggestedTime: string; note: string }) => {
        const url = `/mobile-spa/${id}/suggest-time`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    complete: (id: string) => {
        const url = `/mobile-spa/${id}/complete`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, {})
    }
}
