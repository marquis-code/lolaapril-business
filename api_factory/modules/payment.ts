import { GATEWAY_ENDPOINT } from '../axios.config'

export const payment_api = {
    initializePayment: (payload: any) => {
        const url = "/payments/initialize"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    verifyPayment: (reference: string) => {
        const url = `/payments/verify/${reference}`
        return GATEWAY_ENDPOINT.get(url)
    },
    myTransactions: () => {
        const url = `/payments/my/transactions`
        return GATEWAY_ENDPOINT.get(url)
    }
}
