import { ref } from 'vue'
import { voucher_api } from '~/api_factory/modules'

export const useUseVoucher = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (voucherCode: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.useVoucher(voucherCode)
            return response.data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
