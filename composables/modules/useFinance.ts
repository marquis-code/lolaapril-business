import type { Sale, Payment, CreateSaleDto } from '~/types/finance'
import { finance_api } from '~/api_factory/modules'

export const useFinance = () => {
    const businessId = useCookie('businessId')

    const sales = ref<Sale[]>([])
    const payments = ref<Payment[]>([])
    const stats = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchSales = async () => {
        loading.value = true
        try {
            const { data } = await finance_api.getSales(businessId.value!)
            sales.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchPayments = async () => {
        loading.value = true
        try {
            const { data } = await finance_api.getPayments(businessId.value!)
            payments.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const createSale = async (payload: CreateSaleDto) => {
        loading.value = true
        try {
            const { data } = await finance_api.createSale(payload)
            await fetchSales()
            return data
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const fetchStats = async () => {
        try {
            const [salesStats, paymentStats] = await Promise.all([
                finance_api.getSalesStats(),
                finance_api.getPaymentsStats()
            ])
            stats.value = {
                sales: salesStats.data,
                payments: paymentStats.data
            }
        } catch (e: any) {
            console.error(e)
        }
    }

    return {
        sales,
        payments,
        stats,
        loading,
        error,
        fetchSales,
        fetchPayments,
        createSale,
        fetchStats
    }
}
