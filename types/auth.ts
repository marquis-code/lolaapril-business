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