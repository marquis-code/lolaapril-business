import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type {
    AssignStaffDto,
    AutoAssignStaffDto,
    CheckInStaffDto,
    CompleteAssignmentDto,
    CreateStaffDto,
    CreateStaffScheduleDto,
    StaffSkill
} from '~/types/staff'

export const staff_api = {
    getStaff: (params?: { status?: string }) => {
        const url = "/staff/business"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getStaffById: (staffId: string) => {
        const url = `/staff/${staffId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getAvailableStaff: (params: { date: string; startTime: string; endTime: string; serviceId: string }) => {
        const url = "/staff/available"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    createStaff: (payload: CreateStaffDto) => {
        const url = "/staff"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    createSchedule: (payload: CreateStaffScheduleDto) => {
        const url = "/staff/schedule"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getSchedule: (staffId: string, params?: { date?: string }) => {
        const url = `/staff/schedule/${staffId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    assignStaff: (payload: AssignStaffDto) => {
        const url = "/staff/assign"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    autoAssignStaff: (payload: AutoAssignStaffDto) => {
        const url = "/staff/auto-assign"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    checkInStaff: (payload: CheckInStaffDto) => {
        const url = "/staff/checkin"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    checkOutStaff: (staffId: string) => {
        const url = "/staff/checkout"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { staffId })
    },

    getAssignments: (staffId: string, params: { startDate: string; endDate: string }) => {
        const url = `/staff/assignments/${staffId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getWorkingHours: (staffId: string, params: { startDate: string; endDate: string }) => {
        const url = `/staff/working-hours/${staffId}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    completeAssignment: (assignmentId: string, payload: CompleteAssignmentDto) => {
        const url = `/staff/assignment/${assignmentId}/complete`
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
    },

    updateStaffSkills: (staffId: string, skills: StaffSkill[]) => {
        const url = `/staff/${staffId}/skills`
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, { skills })
    },

    updateStaffStatus: (staffId: string, status: string, reason?: string) => {
        const url = `/staff/${staffId}/status`
        return GATEWAY_ENDPOINT_WITH_AUTH.put(url, { status, reason })
    }
}
