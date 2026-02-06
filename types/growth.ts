// Voucher Types
export interface Voucher {
    _id: string;
    businessId: string;
    voucherCode: string;
    voucherName: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    validFrom: string;
    validUntil: string;
    usageLimit?: number;
    usageCount: number;
    isActive: boolean;
    applicableServiceIds?: string[];
    createdAt: string;
}

export interface CreateVoucherDto {
    voucherCode: string;
    voucherName: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    validFrom: string;
    validUntil: string;
    usageLimit?: number;
    applicableServiceIds?: string[];
}

// Membership Types
export interface MembershipBenefit {
    benefitType: 'discount' | 'free_service' | 'priority_booking' | 'exclusive_access'
    description: string
    discountPercentage?: number
    freeServiceId?: string
    freeServiceName?: string
}

export interface MembershipTier {
    tierName: string
    tierLevel: number
    minimumSpend: number
    pointsMultiplier: number
    benefits: MembershipBenefit[]
    tierColor: string
}

export interface MembershipProgram {
    _id: string
    membershipName: string
    description: string
    membershipType: 'points_based' | 'tier_based' | 'subscription' | 'prepaid'
    tiers?: MembershipTier[]
    pointsPerDollar?: number
    pointsRedemptionValue?: number
    subscriptionPrice?: number
    subscriptionDuration?: number
    generalBenefits?: MembershipBenefit[]
    isActive?: boolean
    createdBy: string
    createdAt?: string
    updatedAt?: string
}

export interface ClientMembership {
    _id: string
    clientId: string
    membershipId: string
    membershipNumber: string
    joinDate: string
    expiryDate?: string
    totalPoints?: number
    totalSpent?: number
    currentTier?: string
    tierProgress?: number
    status?: 'active' | 'inactive' | 'expired' | 'suspended'
}

// Subscription Types
export interface Subscription {
    _id: string;
    businessId: string;
    planName: string;
    planType: 'basic' | 'premium' | 'enterprise';
    price: number;
    billingCycle: 'monthly' | 'annually';
    features: string[];
    status: 'active' | 'cancelled' | 'expired';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
}

// Analytics Types
export interface DashboardMetrics {
    today: {
        revenue: number;
        bookings: number;
        netRevenue: number;
        clients: number;
    };
    monthToDate: {
        revenue: number;
        bookings: number;
        netRevenue: number;
        commissionSavings: number;
    };
    pending: {
        bookings: number;
        amount: number;
    };
    trends: {
        revenueChange: number;
        bookingsChange: number;
    };
}

export interface RevenueChartData {
    date: string;
    revenue: number;
    bookings: number;
}

// Commission Types
export interface CommissionBreakdown {
    summary: {
        totalBookings: number;
        totalRevenue: number;
        directBookings: number;
        marketplaceBookings: number;
        directRevenue: number;
        marketplaceRevenue: number;
        marketplaceCommissions: number;
        averageCommissionRate: number;
    };
    bySource: Array<{
        source: string;
        bookings: number;
        revenue: number;
        commission: number;
    }>;
}
