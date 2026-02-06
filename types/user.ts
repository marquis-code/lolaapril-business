// types/user.ts

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language: string
  timezone: string
  currency: string
  _id?: string
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'business_owner' | 'admin' | 'staff' | 'customer'
  status: 'active' | 'inactive' | 'suspended'
  ownedBusinesses: string[]
  adminBusinesses: string[]
  emailVerified: boolean
  phoneVerified: boolean
  authProvider: 'local' | 'google' | 'facebook'
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
  __v?: number
  currentBusinessId?: string
  id: string
}

export interface SubscriptionLimits {
  features: {
    onlineBooking: boolean
    analytics: boolean
    marketing: boolean
    inventory: boolean
    multiLocation: boolean
    apiAccess: boolean
    customBranding: boolean
    advancedReports: boolean
  }
  maxStaff: number
  maxServices: number
  maxAppointmentsPerMonth: number
  maxStorageGB: number
  _id?: string
}

export interface Subscription {
  _id: string
  businessId: string
  planType: 'trial' | 'basic' | 'professional' | 'enterprise'
  planName: string
  monthlyPrice: number
  yearlyPrice: number
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  endDate: string
  nextBillingDate: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  limits: SubscriptionLimits
  trialDays?: number
  autoRenew: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface Business {
  id: string
  businessName: string
  subdomain: string
  businessType?: 'salon' | 'spa' | 'barbershop' | 'beauty_clinic' | 'wellness_center' | 'other'
  status: 'trial' | 'active' | 'suspended' | 'inactive'
  trialEndsAt?: string
  subscription?: Subscription
}

export interface BusinessSummary {
  id: string
  businessName: string
  subdomain: string
  status: 'trial' | 'active' | 'suspended' | 'inactive'
}

export interface AuthResponse {
  user: User
  business: Business
  businesses: BusinessSummary[]
  accessToken: string
  refreshToken: string
}
