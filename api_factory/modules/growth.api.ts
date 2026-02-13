import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type {
    MembershipProgram,
    VoucherQueryDto,
    CreateVoucherDto
} from '~/types/growth'

export const growth_api = {
    // Vouchers
    getVouchers: (params: VoucherQueryDto = {}) => {
        const url = '/vouchers'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    createVoucher: (payload: CreateVoucherDto) => {
        const url = '/vouchers'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    deleteVoucher: (id: string) => {
        const url = `/vouchers/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    // Memberships
    getPrograms: (params?: {
        membershipType?: string
        isActive?: boolean
        search?: string
        page?: number
        limit?: number
    }) => {
        const url = '/memberships'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    createProgram: (payload: Partial<MembershipProgram>) => {
        const url = '/memberships'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    enrollClient: (payload: {
        clientId: string
        membershipId: string
        membershipNumber: string
        joinDate: string
        expiryDate?: string
        totalPoints?: number
        totalSpent?: number
        currentTier?: string
        tierProgress?: number
        status?: string
    }) => {
        const url = '/memberships/enroll'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    // Analytics (delegated to analytics_api but included here for useGrowth context if needed)
    getDashboardMetrics: (businessId: string) => {
        const url = `/analytics/dashboard/${businessId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getRevenueTrends: (params: { startDate: string, endDate: string, granularity?: string }) => {
        const url = '/analytics/revenue/trends'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getCommissionBreakdown: (params: { startDate: string, endDate: string }) => {
        const url = '/analytics/commissions/breakdown'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    }
}
