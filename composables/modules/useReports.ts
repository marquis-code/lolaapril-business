import type { DailySalesSummary } from '@/types/settings'
import { reports_api } from '@/api_factory/modules'

export const useReports = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const generateDailySalesSummary = async (date: string) => {
        loading.value = true
        try {
            const { data } = await reports_api.generateDailySalesSummary(date)
            return data.data || data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    const getDailySalesSummary = async (date: string) => {
        loading.value = true
        try {
            const { data } = await reports_api.getDailySalesSummary(date)
            return data.data || data
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    const getWeeklySalesReport = async (startDate: string, endDate: string) => {
        loading.value = true
        try {
            const { data } = await reports_api.getWeeklySalesReport({ startDate, endDate })
            return data.data || data
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    const getMonthlySalesReport = async (year: number, month: number) => {
        loading.value = true
        try {
            const { data } = await reports_api.getMonthlySalesReport({ year, month })
            return data.data || data
        } catch (e: any) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        generateDailySalesSummary,
        getDailySalesSummary,
        getWeeklySalesReport,
        getMonthlySalesReport
    }
}
