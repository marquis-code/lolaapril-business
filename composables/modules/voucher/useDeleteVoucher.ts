import { ref } from 'vue'
import { voucher_api } from '~/api_factory/modules'

export const useDeleteVoucher = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            await voucher_api.deleteVoucher(id)
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
