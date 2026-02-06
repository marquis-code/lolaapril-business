import { ref } from 'vue'
import type { VoucherStats } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useFetchVoucherStats = () => {
    const data = ref<VoucherStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.getStats()
            data.value = response.data.data || response.data
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
