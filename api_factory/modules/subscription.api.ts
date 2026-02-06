import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const subscription_api = {
    getSubscriptions: (businessId: string) => {
        const url = "/subscriptions"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: { businessId } })
    },

    getActiveSubscription: (businessId: string) => {
        const url = `/subscriptions/active/${businessId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createSubscription: (payload: { businessId: string, planType: string, billingCycle: string }) => {
        const url = "/subscriptions"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    cancelSubscription: (id: string, reason?: string) => {
        const url = `/subscriptions/${id}/cancel`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { reason })
    },

    renewSubscription: (id: string) => {
        const url = `/subscriptions/${id}/renew`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    }
}
