import type {
    Voucher, CreateVoucherDto,
    MembershipProgram, ClientMembership,
    Subscription,
    DashboardMetrics, RevenueChartData, CommissionBreakdown
} from '~/types/growth'

// Voucher Composable
export const useVoucher = () => {
    const api = useApi()
    const businessId = useCookie('businessId')

    const vouchers = ref<Voucher[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchVouchers = async () => {
        loading.value = true
        try {
            const { data } = await api.get<{ data: Voucher[] }>('/vouchers', {
                params: { businessId: businessId.value }
            })
            vouchers.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const createVoucher = async (payload: CreateVoucherDto) => {
        loading.value = true
        try {
            await api.post('/vouchers', { ...payload, businessId: businessId.value })
            await fetchVouchers()
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const deleteVoucher = async (id: string) => {
        try {
            await api.delete(`/vouchers/${id}`)
            vouchers.value = vouchers.value.filter(v => v._id !== id)
        } catch (e: any) {
            throw e
        }
    }

    return {
        vouchers,
        loading,
        error,
        fetchVouchers,
        createVoucher,
        deleteVoucher
    }
}

// Membership Composable
export const useMembership = () => {
    const api = useApi()

    const programs = ref<MembershipProgram[]>([])
    const clientMemberships = ref<ClientMembership[]>([])
    const loading = ref(false)

    const fetchPrograms = async (params?: {
        membershipType?: string
        isActive?: boolean
        search?: string
        page?: number
        limit?: number
    }) => {
        loading.value = true
        try {
            const { data } = await api.get<{ data: MembershipProgram[] }>('/memberships', { params })
            programs.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createProgram = async (payload: Partial<MembershipProgram>) => {
        try {
            await api.post('/memberships', payload)
            await fetchPrograms()
        } catch (e: any) {
            throw e
        }
    }

    const enrollClient = async (payload: {
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
        try {
            await api.post('/memberships/enroll', payload)
        } catch (e: any) {
            throw e
        }
    }

    return {
        programs,
        clientMemberships,
        loading,
        fetchPrograms,
        createProgram,
        enrollClient
    }
}

// Analytics Composable
export const useAnalytics = () => {
    const api = useApi()
    const businessId = useCookie('businessId')

    const dashboardMetrics = ref<DashboardMetrics | null>(null)
    const loading = ref(false)

    const fetchDashboardMetrics = async () => {
        loading.value = true
        try {
            const { data } = await api.get(`/analytics/dashboard/${businessId.value}`)
            dashboardMetrics.value = data.data || data
        } catch (e: any) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const fetchRevenueTrends = async (startDate: string, endDate: string, granularity = 'daily') => {
        try {
            const { data } = await api.get('/analytics/revenue/trends', {
                params: { businessId: businessId.value, startDate, endDate, granularity }
            })
            return data.data
        } catch (e: any) {
            throw e
        }
    }

    const fetchCommissionBreakdown = async (startDate: string, endDate: string) => {
        try {
            const { data } = await api.get('/analytics/commissions/breakdown', {
                params: { businessId: businessId.value, startDate, endDate }
            })
            return data.data
        } catch (e: any) {
            throw e
        }
    }

    return {
        dashboardMetrics,
        loading,
        fetchDashboardMetrics,
        fetchRevenueTrends,
        fetchCommissionBreakdown
    }
}
