import { ref } from 'vue'
import type { Voucher } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useFetchVoucherByCode = () => {
    const data = ref<Voucher | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (code: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.getVoucherByCode(code)
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
