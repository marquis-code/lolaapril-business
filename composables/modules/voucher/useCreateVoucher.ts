import { ref } from 'vue'
import type { CreateVoucherDto } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useCreateVoucher = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (payload: CreateVoucherDto) => {
        loading.value = true
        error.value = null
        try {
            await voucher_api.createVoucher(payload)
            return true
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, execute }
}
