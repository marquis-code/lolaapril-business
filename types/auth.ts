// types/auth.ts
export interface BusinessOwner {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface BusinessAddress {
  street: string
  city: string
  state: string
  country: string
  postalCode?: string
}

export interface BusinessContact {
  primaryPhone: string
  email: string
  website?: string
}

export interface BusinessRegisterDto {
  owner: BusinessOwner
  businessName: string
  subdomain: string
  businessType: 'salon' | 'spa' | 'barbershop' | 'beauty_clinic' | 'wellness_center' | 'other'
  businessDescription?: string
  address: BusinessAddress
  contact: BusinessContact
}

export interface BusinessLoginDto {
  email: string
  password: string
  subdomain?: string
}

export interface SubdomainCheckResponse {
  available: boolean
  subdomain: string
}

// ==================== ADD BUSINESS DTO ====================
export interface AddBusinessDto {
  businessName: string
  subdomain: string
  businessType: 'salon' | 'spa' | 'barbershop' | 'beauty_clinic' | 'wellness_center' | 'other'
  businessDescription?: string
  address: BusinessAddress
  contact: BusinessContact
}

// ==================== SWITCH BUSINESS DTO ====================
export interface SwitchBusinessDto {
  businessId: string
}

// ==================== USER ====================
export interface User {
  id: string
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'business_owner' | 'business_admin' | 'staff' | 'client'
  status: 'active' | 'inactive' | 'suspended'
  profileImage?: string
  emailVerified?: boolean
  phoneVerified?: boolean
  authProvider?: 'local' | 'google' | 'facebook'
  ownedBusinesses?: string[]
  adminBusinesses?: string[]
  currentBusinessId?: string
  preferences?: UserPreferences
  createdAt?: string
  updatedAt?: string
}

export interface UserPreferences {
  notifications?: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language?: string
  timezone?: string
  currency?: string
}

// ==================== BUSINESS ====================
export interface Business {
  id: string
  _id?: string
  businessName: string
  subdomain: string
  businessType?: 'salon' | 'spa' | 'barbershop' | 'beauty_clinic' | 'wellness_center' | 'other'
  businessDescription?: string
  status: 'trial' | 'active' | 'suspended' | 'expired' | 'inactive'
  trialEndsAt?: string
  subscription?: Subscription
  address?: BusinessAddress
  contact?: BusinessContact
}

export interface BusinessSummary {
  id: string
  businessName: string
  subdomain: string
  status: 'trial' | 'active' | 'suspended' | 'expired' | 'inactive'
  isOwner?: boolean
  isCurrent?: boolean
}

// ==================== SUBSCRIPTION ====================
export interface Subscription {
  _id: string
  planType: 'trial' | 'basic' | 'professional' | 'enterprise'
  planName: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  startDate: string
  endDate: string
}

// ==================== AUTH RESPONSE ====================
export interface AuthResponse {
  user: User
  business?: Business
  businesses?: BusinessSummary[]
  accessToken: string
  refreshToken: string
  success?: boolean
  message?: string
}

// ==================== SWITCH BUSINESS RESPONSE ====================
export interface SwitchBusinessResponse {
  success: boolean
  message: string
  business: Business
  accessToken: string
  refreshToken: string
}

// ==================== ADD BUSINESS RESPONSE ====================
export interface AddBusinessResponse {
  success: boolean
  message: string
  business: Business
  accessToken: string
  refreshToken: string
}

// ==================== GET BUSINESSES RESPONSE ====================
export interface GetBusinessesResponse {
  businesses: Array<BusinessSummary & {
    isOwner: boolean
    isCurrent: boolean
  }>
  currentBusinessId: string | null
}

// ==================== CLEAR CONTEXT RESPONSE ====================
export interface ClearContextResponse {
  success: boolean
  message: string
  accessToken: string
  refreshToken: string
}

// ==================== PROFILE UPDATE DTOs ====================
export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  phone?: string
  profileImage?: string
  bio?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}

export interface UpdatePreferencesDto {
  notifications?: {
    email?: boolean
    sms?: boolean
    push?: boolean
  }
  language?: string
  timezone?: string
  currency?: string
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateEmailDto {
  newEmail: string
  password: string
}

// ==================== FIREBASE / SOCIAL AUTH ====================
export interface FirebaseAuthDto {
  idToken: string
  subdomain?: string
}

export interface GoogleAuthDto {
  idToken: string
  subdomain?: string
}

// ==================== PASSWORD RESET DTOs ====================
export interface ForgotPasswordDto {
  email: string
}

export interface VerifyResetOTPDto {
  email: string
  otp: string
}

export interface ResetPasswordDto {
  email: string
  otp: string
  newPassword: string
}

// ==================== REFRESH TOKEN ====================
export interface RefreshTokenDto {
  userId: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}