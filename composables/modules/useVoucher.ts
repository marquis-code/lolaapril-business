import type { Voucher, CreateVoucherDto, UpdateVoucherDto, VoucherQueryDto, VoucherStats } from '~/types/voucher'
import { voucher_api } from '~/api_factory/modules'

export const useVoucher = () => {
    const vouchers = ref<Voucher[]>([])
    const stats = ref<VoucherStats | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchVouchers = async (params: VoucherQueryDto = {}) => {
        loading.value = true
        try {
            const { data } = await voucher_api.getVouchers(params)
            vouchers.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const fetchVoucherById = async (id: string) => {
        try {
            const { data } = await voucher_api.getVoucherById(id)
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const fetchVoucherByCode = async (code: string) => {
        try {
            const { data } = await voucher_api.getVoucherByCode(code)
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const createVoucher = async (payload: CreateVoucherDto) => {
        loading.value = true
        try {
            await voucher_api.createVoucher(payload)
            await fetchVouchers()
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateVoucher = async (id: string, payload: UpdateVoucherDto) => {
        try {
            await voucher_api.updateVoucher(id, payload)
            await fetchVouchers()
        } catch (e: any) {
            throw e
        }
    }

    const deleteVoucher = async (id: string) => {
        try {
            await voucher_api.deleteVoucher(id)
            vouchers.value = vouchers.value.filter(v => v._id !== id)
        } catch (e: any) {
            throw e
        }
    }

    const validateVoucher = async (voucherCode: string, clientId: string, serviceIds: string[], totalAmount: number) => {
        try {
            const { data } = await voucher_api.validateVoucher({
                voucherCode,
                clientId,
                serviceIds,
                totalAmount
            })
            return data
        } catch (e: any) {
            throw e
        }
    }

    const fetchStats = async () => {
        try {
            const { data } = await voucher_api.getStats()
            stats.value = data?.data || data
        } catch (e: any) {
            console.error(e)
        }
    }

    const useVoucherCode = async (voucherCode: string) => {
        try {
            const { data } = await voucher_api.useVoucher(voucherCode)
            return data
        } catch (e: any) {
            throw e
        }
    }

    return {
        vouchers,
        stats,
        loading,
        error,
        fetchVouchers,
        fetchVoucherById,
        fetchVoucherByCode,
        createVoucher,
        updateVoucher,
        deleteVoucher,
        validateVoucher,
        fetchStats,
        useVoucherCode
    }
}
