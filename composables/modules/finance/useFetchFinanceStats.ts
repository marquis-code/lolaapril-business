import { ref } from 'vue'
import { finance_api } from '~/api_factory/modules'

export const useFetchFinanceStats = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const [salesStats, paymentsStats] = await Promise.all([
                finance_api.getSalesStats(),
                finance_api.getPaymentsStats()
            ])
            console.log('Sales Stats:', salesStats.data)
            console.log('Payments Stats:', paymentsStats.data)
            data.value = {
                sales: salesStats.data,
                payments: paymentsStats.data
            }
            return data.value
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
