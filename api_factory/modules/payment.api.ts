import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const payment_api = {
  initializePayment: (payload: Record<string, any>) => {
    const url = '/payments/initialize'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  verifyPayment: (reference: string) => {
    const url = `/payments/verify/${reference}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  initiateRefund: (reference: string, payload?: { amount?: number }) => {
    const url = `/payments/${reference}/refund`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  createPayment: (payload: Record<string, any>) => {
    const url = '/payments'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getMyTransactions: () => {
    const url = '/payments/my/transactions'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getPayments: (params?: Record<string, any>) => {
    const url = '/payments'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  getStats: () => {
    const url = '/payments/stats'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getPaymentById: (id: string) => {
    const url = `/payments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updatePayment: (id: string, payload: Record<string, any>) => {
    const url = `/payments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateStatus: (id: string, payload: { status: string; transactionId?: string }) => {
    const url = `/payments/${id}/status`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  processRefund: (id: string, payload: { refundAmount: number; refundReason: string }) => {
    const url = `/payments/${id}/refund`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  deletePayment: (id: string) => {
    const url = `/payments/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
  }
}
