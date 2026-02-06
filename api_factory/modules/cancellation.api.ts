import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const cancellation_api = {
  // Policy
  getPolicy: () => {
    const url = '/cancellation/policy'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getPolicyForService: (serviceId: string) => {
    const url = `/cancellation/policy/service/${serviceId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  createOrUpdatePolicy: (payload: any) => {
    const url = '/cancellation/policy'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  updatePolicy: (payload: any) => {
    const url = '/cancellation/policy'
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
  },

  // Appointment cancellation & refunds
  cancelAppointment: (appointmentId: string, payload: any) => {
    const url = `/cancellation/appointments/${appointmentId}/cancel`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  calculateRefund: (payload: any) => {
    const url = '/cancellation/calculate-refund'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },

  // No-show
  recordNoShow: (appointmentId: string, payload: any) => {
    const url = `/cancellation/appointments/${appointmentId}/no-show`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },

  // Client reliability
  getClientReliability: (clientId: string) => {
    const url = `/cancellation/clients/${clientId}/reliability`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getClientHistory: (clientId: string, limit?: number) => {
    const url = `/cancellation/clients/${clientId}/history`
    const params = limit ? { limit } : undefined
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  checkDepositRequirement: (clientId: string) => {
    const url = `/cancellation/clients/${clientId}/deposit-check`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
  },

  // Analytics
  getNoShowAnalytics: (params?: { startDate?: string; endDate?: string }) => {
    const url = '/cancellation/analytics/no-shows'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  getAnalyticsSummary: (period?: string) => {
    const url = '/cancellation/analytics/summary'
    const params = period ? { period } : undefined
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  getCancellationTrends: (params: { startDate: string; endDate: string; groupBy?: 'day' | 'week' | 'month' }) => {
    const url = '/cancellation/analytics/trends'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },

  // Deposit calculation
  calculateDeposit: (payload: { totalAmount: number; clientId?: string; serviceIds?: string[] }) => {
    const url = '/cancellation/calculate-deposit'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  }
}
