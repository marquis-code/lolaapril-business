import { ref } from 'vue'
import type { Voucher, VoucherQueryDto, CreateVoucherDto } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useFetchVouchers = () => {
    const data = ref<Voucher[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const execute = async (params: VoucherQueryDto = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await voucher_api.getVouchers(params)
            if ([200, 201].includes(response.status)) {
                data.value = Array.isArray(response.data) ? response.data : (response.data.vouchers || [])
                return data.value
            }
            return []
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { data, loading, error, execute }
}
