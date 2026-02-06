import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const reports_api = {
    generateDailySalesSummary: (date: string) => {
        const url = `/reports/daily-sales/${date}`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    getDailySalesSummary: (date: string) => {
        const url = `/reports/daily-sales/${date}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getWeeklySalesReport: (params: { startDate: string, endDate: string }) => {
        const url = "/reports/weekly-sales"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getMonthlySalesReport: (params: { year: number, month: number }) => {
        const url = "/reports/monthly-sales"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    }
}
