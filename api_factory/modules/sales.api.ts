import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const sales_api = {
  createSale: (payload: Record<string, any>) => {
    const url = '/sales'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getSales: (params?: Record<string, any>) => {
    const url = '/sales'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  getSalesStats: () => {
    const url = '/sales/stats'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getTopServices: () => {
    const url = '/sales/top-services'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getRevenueByPeriod: (period: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    const url = '/sales/revenue-by-period'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: { period } })
  },
  getSaleById: (id: string) => {
    const url = `/sales/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateSale: (id: string, payload: Record<string, any>) => {
    const url = `/sales/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  completeSale: (id: string, payload: { completedBy: string }) => {
    const url = `/sales/${id}/complete`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updateStatus: (id: string, payload: { status: string }) => {
    const url = `/sales/${id}/status`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  updatePaymentStatus: (id: string, payload: { paymentStatus: string; amountPaid?: number }) => {
    const url = `/sales/${id}/payment-status`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },
  deleteSale: (id: string) => {
    const url = `/sales/${id}`
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
  }
}
