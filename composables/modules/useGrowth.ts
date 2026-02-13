import { growth_api } from '@/api_factory/modules/growth.api'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'
import type {
    Voucher, CreateVoucherDto,
    MembershipProgram, ClientMembership,
    Subscription,
    DashboardMetrics, RevenueChartData, CommissionBreakdown
} from '~/types/growth'

// Voucher Composable
export const useVoucher = () => {
    const { businessId } = useUser()

    const vouchers = ref<Voucher[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchVouchers = async () => {
        loading.value = true
        try {
            const response = await growth_api.getVouchers()
            if ([200, 201].includes(response.status)) {
                vouchers.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            }
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const createVoucher = async (payload: CreateVoucherDto) => {
        const { showToast } = useCustomToast()
        loading.value = true
        try {
            const response = await growth_api.createVoucher(payload)
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Voucher created successfully',
                    toastType: 'success'
                })
                await fetchVouchers()
            }
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const deleteVoucher = async (id: string) => {
        const { showToast } = useCustomToast()
        try {
            const response = await growth_api.deleteVoucher(id)
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Voucher deleted successfully',
                    toastType: 'success'
                })
                vouchers.value = vouchers.value.filter(v => v._id !== id)
            }
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
            const response = await growth_api.getPrograms(params)
            if ([200, 201].includes(response.status)) {
                programs.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const createProgram = async (payload: Partial<MembershipProgram>) => {
        const { showToast } = useCustomToast()
        try {
            const response = await growth_api.createProgram(payload)
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Membership program created successfully',
                    toastType: 'success'
                })
                await fetchPrograms()
            }
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
        const { showToast } = useCustomToast()
        try {
            const response = await growth_api.enrollClient(payload)
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Client enrolled successfully',
                    toastType: 'success'
                })
            }
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
    const { businessId } = useUser()

    const dashboardMetrics = ref<DashboardMetrics | null>(null)
    const loading = ref(false)

    const fetchDashboardMetrics = async () => {
        loading.value = true
        try {
            const response = await growth_api.getDashboardMetrics(businessId.value)
            if ([200, 201].includes(response.status)) {
                dashboardMetrics.value = response.data.data || response.data
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const fetchRevenueTrends = async (startDate: string, endDate: string, granularity = 'daily') => {
        try {
            const response = await growth_api.getRevenueTrends({ startDate, endDate, granularity })
            if ([200, 201].includes(response.status)) {
                return response.data.data
            }
            return []
        } catch (e: any) {
            throw e
        }
    }

    const fetchCommissionBreakdown = async (startDate: string, endDate: string) => {
        try {
            const response = await growth_api.getCommissionBreakdown({ startDate, endDate })
            if ([200, 201].includes(response.status)) {
                return response.data.data
            }
            return null
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
