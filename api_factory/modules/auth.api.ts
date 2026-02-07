import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { 
  BusinessLoginDto, 
  BusinessRegisterDto, 
  AddBusinessDto,
  SwitchBusinessDto 
} from '~/types/auth'

export const auth_api = {
  // ==================== AUTHENTICATION ====================
  login: (credentials: BusinessLoginDto) => {
    return GATEWAY_ENDPOINT.post('/auth/business/login', credentials)
  },

  register: (payload: BusinessRegisterDto) => {
    return GATEWAY_ENDPOINT.post('/auth/business/register', payload)
  },

  logout: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/logout')
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/profile')
  },

  refreshToken: (payload: { userId: string; refreshToken: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/refresh', payload)
  },

  // ==================== PROFILE MANAGEMENT ====================
  updateProfile: (payload: {
    firstName?: string
    lastName?: string
    phone?: string
    profileImage?: string
    bio?: string
    dateOfBirth?: string
    gender?: string
  }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch('/auth/profile', payload)
  },

  updatePreferences: (preferences: {
    notifications?: { email?: boolean; sms?: boolean; push?: boolean }
    language?: string
    timezone?: string
    currency?: string
  }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch('/auth/preferences', preferences)
  },

  changePassword: (payload: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/change-password', payload)
  },

  updateEmail: (payload: { newEmail: string; password: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch('/auth/email', payload)
  },

  deleteAccount: (password?: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete('/auth/account', { 
      data: { password } 
    })
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

  // ==================== BUSINESS CONTEXT MANAGEMENT ====================
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

  addBusiness: (payload: AddBusinessDto) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/auth/business/add', payload)
  },

  // ==================== FIREBASE/SOCIAL AUTH ====================
  firebaseAuth: (payload: { idToken: string; subdomain?: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/firebase', payload)
  },

  googleAuth: (payload: { idToken: string; subdomain?: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/google/token', payload)
  }
}
