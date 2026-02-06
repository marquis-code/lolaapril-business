import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const auth_api = {
  // ==================== EXISTING ====================
  login: (credentials: any) => {
    return GATEWAY_ENDPOINT.post('/auth/business/login', credentials)
  },

  register: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/business/register', payload)
  },

  logout: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/logout')
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/profile')
  },

  refreshToken: (refreshToken: string) => {
    return GATEWAY_ENDPOINT.post('/auth/refresh', { refreshToken })
  },

  // ==================== PASSWORD RESET ====================
  forgotPassword: (email: string) => {
    return GATEWAY_ENDPOINT.post('/auth/forgot-password', { email })
  },

  verifyResetOTP: (payload: { email: string; otp: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/verify-reset-otp', payload)
  },

  resetPassword: (payload: {
    email: string
    otp: string
    newPassword: string
  }) => {
    return GATEWAY_ENDPOINT.post('/auth/reset-password', payload)
  },

  // ==================== BUSINESS CONTEXT ====================
  switchBusiness: (businessId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/switch-business', {
      businessId
    })
  },

  clearBusinessContext: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/clear-business-context')
  },

  getUserBusinesses: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/businesses')
  },

  addBusiness: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/business/add', payload)
  }
}
