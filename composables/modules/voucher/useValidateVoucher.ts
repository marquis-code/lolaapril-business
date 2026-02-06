import { ref } from 'vue'
import { voucher_api } from '~/api_factory/modules'

export const useValidateVoucher = () => {
    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (voucherCode: string, clientId: string, serviceIds: string[], totalAmount: number) => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.validateVoucher({
                voucherCode,
                clientId,
                serviceIds,
                totalAmount
            })
            data.value = response.data
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
