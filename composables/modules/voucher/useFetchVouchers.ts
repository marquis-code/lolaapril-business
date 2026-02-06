import { ref } from 'vue'
import type { Voucher, VoucherQueryDto } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useFetchVouchers = () => {
    const data = ref<Voucher[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: VoucherQueryDto = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.getVouchers(params)
            console.log('Fetch Vouchers Response:', response)   
            data.value = response.data?.vouchers
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
