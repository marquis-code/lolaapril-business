import { ref } from 'vue'
import type { UpdateVoucherDto } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useUpdateVoucher = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string, payload: UpdateVoucherDto) => {
        loading.value = true
        error.value = null
        try {
            await voucher_api.updateVoucher(id, payload)
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
