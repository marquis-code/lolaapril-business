import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const commission_api = {
  createTrackingCode: (payload: any) => {
    const url = '/commission/tracking-codes'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getTrackingCodes: () => {
    const url = '/commission/tracking-codes'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  validateTrackingCode: (code: string) => {
    const url = `/commission/tracking-codes/${code}/validate`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getBookingCommission: (bookingId: string) => {
    const url = `/commission/bookings/${bookingId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getCommissionSummary: (params?: { startDate?: string; endDate?: string; status?: string }) => {
    const url = '/commission/business/summary'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  disputeCommission: (commissionId: string, payload: { reason: string; disputedBy: string }) => {
    const url = `/commission/${commissionId}/dispute`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getSourceBreakdown: (params: { startDate: string; endDate: string }) => {
    const url = '/commission/analytics/source-breakdown'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  getQrCodeUrl: (code: string) => {
    return `/qr/${code}`
  },
  getQrCodeDownloadUrl: (code: string) => {
    return `/qr/${code}/download`
  }
}
