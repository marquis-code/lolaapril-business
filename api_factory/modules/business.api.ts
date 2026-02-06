import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const business_api = {
  // ==================== PUBLIC ====================
  checkSubdomainAvailability: (subdomain: string) => {
    return GATEWAY_ENDPOINT.get('/businesses/check-subdomain', {
      params: { subdomain }
    })
  },

  getBusinessBySubdomain: (subdomain: string) => {
    return GATEWAY_ENDPOINT.get(`/businesses/subdomain/${subdomain}`)
  },

  getBusinessByIdPublic: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/businesses/${id}`)
  },

  // ==================== AUTHENTICATED ====================
  getMyBusinesses: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/businesses')
  },

  updateBusiness: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/businesses/${id}`, payload)
  },

  // ==================== STAFF ====================
  addStaff: (
    businessId: string,
    payload: { email: string; firstName: string; lastName: string; phone?: string }
  ) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(
      `/businesses/${businessId}/staff`,
      payload
    )
  },

  removeStaff: (businessId: string, staffId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(
      `/businesses/${businessId}/staff/${staffId}`
    )
  },

  // ==================== ADMINS ====================
  addAdmin: (businessId: string, adminId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(
      `/businesses/${businessId}/admin/${adminId}`
    )
  },

  removeAdmin: (businessId: string, adminId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(
      `/businesses/${businessId}/admin/${adminId}`
    )
  },

  // ==================== SETTINGS ====================
  getSettings: (businessId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(
      `/businesses/${businessId}/settings`
    )
  },

  updateSettings: (businessId: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(
      `/businesses/${businessId}/settings`,
      payload
    )
  },

  // ==================== PAYSTACK / KYC ====================
  verifyKYC: (businessId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(
      `/businesses/${businessId}/verify-kyc`
    )
  },

  rejectKYC: (businessId: string, reason: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(
      `/businesses/${businessId}/reject-kyc`,
      { reason }
    )
  },

  createSubaccount: (businessId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(
      `/businesses/${businessId}/create-subaccount`
    )
  },

  getSubaccount: (businessId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(
      `/businesses/${businessId}/subaccount`
    )
  }
}
