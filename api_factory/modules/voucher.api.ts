import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { CreateVoucherDto, UpdateVoucherDto, VoucherQueryDto } from '~/types/voucher'

export const voucher_api = {
    getVouchers: (params: VoucherQueryDto = {}) => {
        const url = "/vouchers"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getVoucherById: (id: string) => {
        const url = `/vouchers/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getVoucherByCode: (code: string) => {
        const url = `/vouchers/code/${code}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    createVoucher: (payload: CreateVoucherDto) => {
        const url = "/vouchers"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    updateVoucher: (id: string, payload: UpdateVoucherDto) => {
        const url = `/vouchers/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    deleteVoucher: (id: string) => {
        const url = `/vouchers/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
    },

    validateVoucher: (payload: { voucherCode: string, clientId: string, serviceIds: string[], totalAmount: number }) => {
        const url = "/vouchers/validate"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    useVoucher: (voucherCode: string) => {
        const url = `/vouchers/${voucherCode}/use`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    getStats: () => {
        const url = "/vouchers/stats"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
