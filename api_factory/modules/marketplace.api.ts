import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const marketplace_api = {
  submitVerification: (tenantId: string, payload: any) => {
    const url = `/marketplace/verification/${tenantId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getVerificationStatus: (tenantId: string) => {
    const url = `/marketplace/verification/${tenantId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getBusinessReviews: (businessId: string, params?: { page?: number; limit?: number }) => {
    const url = `/marketplace/reviews/business/${businessId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  respondToReview: (reviewId: string, payload: { text: string; responderId: string }) => {
    const url = `/marketplace/reviews/${reviewId}/respond`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  markHelpful: (reviewId: string, helpful: boolean) => {
    const url = `/marketplace/reviews/${reviewId}/helpful`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { helpful })
  },
  updateQualityMetrics: (tenantId: string) => {
    const url = `/marketplace/quality/${tenantId}/update`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
  },
  getQualityScore: (tenantId: string) => {
    const url = `/marketplace/quality/${tenantId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  getMarketplaceStats: () => {
    const url = '/marketplace/stats'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  }
}
