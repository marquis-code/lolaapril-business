import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const analytics_api = {
    generateFinancialReport: (params: { startDate: string, endDate: string, reportPeriod?: string }) => {
        const url = "/analytics/reports/generate"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, null, { params })
    },

    getReport: (reportId: string) => {
        const url = `/analytics/reports/${reportId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    exportReportToCSV: (reportId: string) => {
        const url = `/analytics/reports/${reportId}/export`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { responseType: 'blob' })
    },

    getDashboardMetrics: () => {
        const url = `/analytics/dashboard`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getRevenueTrends: (params: { startDate: string, endDate: string, granularity?: string }) => {
        const url = "/analytics/revenue/trends"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getCommissionBreakdown: (params: {startDate: string, endDate: string }) => {
        const url = "/analytics/commissions/breakdown"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getSourcePerformance: (params: { startDate: string, endDate: string }) => {
        const url = "/analytics/sources/performance"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getCommissionInsights: (params?: { months?: number }) => {
        const url = "/analytics/commissions/insights"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getQuickStats: () => {
        const url = `/analytics/quick-stats`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getFeeComparison: () => {
        const url = `/analytics/fee-comparison`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
