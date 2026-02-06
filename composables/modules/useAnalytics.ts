import type { DashboardMetrics, CommissionBreakdown } from '~/types/growth'
import { analytics_api } from '~/api_factory/modules'

export const useAnalytics = () => {
    const dashboardMetrics = ref<DashboardMetrics | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchDashboardMetrics = async () => {
        loading.value = true
        try {
            const { data } = await analytics_api.getDashboardMetrics()
            console.log('Dashboard Metrics Data:', data)
            dashboardMetrics.value = data.data || data
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchRevenueTrends = async (startDate: string, endDate: string, granularity = 'daily') => {
        try {
            const { data } = await analytics_api.getRevenueTrends({
                startDate,
                endDate,
                granularity
            })
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const fetchCommissionBreakdown = async (startDate: string, endDate: string) => {
        try {
            const { data } = await analytics_api.getCommissionBreakdown({
                startDate,
                endDate
            })
            console.log('Commission Breakdown Data:', data)
            return data.data
        } catch (e: any) {
            throw e
        }
    }

    const fetchQuickStats = async () => {
        try {
            const { data } = await analytics_api.getQuickStats()
            console.log('Quick Stats Data:', data)
            return data.data
        } catch (e: any) {
            throw e
        }
    }

    const fetchFeeComparison = async () => {
        try {
            const { data } = await analytics_api.getFeeComparison()
            console.log('Fee Comparison Data:', data)   
            return data.data
        } catch (e: any) {
            throw e
        }
    }

    return {
        dashboardMetrics,
        loading,
        error,
        fetchDashboardMetrics,
        fetchRevenueTrends,
        fetchCommissionBreakdown,
        fetchQuickStats,
        fetchFeeComparison
    }
}
