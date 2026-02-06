export interface PricingTier {
  _id: string
  tierName: string
  tierLevel: number
  monthlyPrice: number
  yearlyPrice: number
  features: {
    maxStaff: number
    maxBookingsPerMonth: number
    customBranding: boolean
    analyticsAccess: boolean
    prioritySupport: boolean
    multiLocation: boolean
    apiAccess: boolean
  }
  commissionRate: number
  description: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FeeStructure {
  _id: string
  businessId?: string
  pricingTierId?: string | PricingTier  // Can be string ID or populated tier object
  platformFeePercentage: number
  platformFeeFixed?: number
  effectiveFrom?: string
  effectiveTo?: string
  isGrandfathered?: boolean
  customRules?: {
    noShowFee?: number
    cancellationFee?: number
    minBookingAmount?: number
  }
  createdAt?: string
  updatedAt?: string
}

export interface PricingHistoryItem {
  _id: string
  businessId?: string
  previousTierId?: string
  newTierId?: string
  reason?: string
  changedBy?: string
  changedAt?: string
  metadata?: Record<string, any>
}
