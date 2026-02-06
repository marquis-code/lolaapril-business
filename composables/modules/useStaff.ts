import type { Staff, CreateStaffDto } from '~/types/staff'
import { staff_api } from '~/api_factory/modules'

export const useStaff = () => {
    const staffList = ref<Staff[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchStaff = async () => {
        loading.value = true
        try {
            const { data } = await staff_api.getStaff({
                status: 'active'
            })
            staffList.value = data.data || []
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    const createStaff = async (payload: CreateStaffDto) => {
        loading.value = true
        try {
            const { data } = await staff_api.createStaff(payload)
            await fetchStaff()
            return data
        } catch (e: any) {
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateStaffStatus = async (staffId: string, status: string, reason?: string) => {
        try {
            await staff_api.updateStaffStatus(staffId, status, reason)
            // Update local state
            const staff = staffList.value.find(s => s._id === staffId)
            if (staff) staff.status = status as any
        } catch (e: any) {
            throw e
        }
    }

    return {
        staffList,
        loading,
        error,
        fetchStaff,
        createStaff,
        updateStaffStatus
    }
}
