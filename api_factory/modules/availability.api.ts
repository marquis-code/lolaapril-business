import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { WeeklyScheduleItem } from '~/types/availability'

export const availability_api = {
    // Public endpoints
    getAvailableSlots: (params: { date: string; serviceIds?: string[]; subdomain?: string; businessId?: string; staffId?: string }) => {
        const url = '/availability/slots'
        return GATEWAY_ENDPOINT.get(url, { params })
    },

    checkSlotAvailability: (params: { businessId: string; date: string; startTime: string; duration: number; staffId?: string }) => {
        const url = '/availability/check'
        return GATEWAY_ENDPOINT.get(url, { params })
    },

    getAllSlots: (params: { startDate: string; endDate: string; subdomain?: string; businessId?: string }) => {
        const url = '/availability/all-slots'
        return GATEWAY_ENDPOINT.get(url, { params })
    },

    getDetailedSlots: (params: { date: string; serviceIds?: string[]; subdomain?: string; businessId?: string; staffId?: string }) => {
        const url = '/availability/slots/detailed'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    // Staff endpoints
    createMyAvailability: (payload: any) => {
        const url = '/availability/staff/my-availability'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    blockMyTime: (payload: any) => {
        const url = '/availability/staff/block-time'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    // Admin/Owner endpoints
    createStaffAvailability: (payload: any) => {
        const url = '/availability/staff/availability'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    blockStaffTime: (payload: any) => {
        const url = '/availability/staff/block'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    createSimpleBusinessHours: (payload: { operates24x7: boolean, weeklySchedule: WeeklyScheduleItem[] }) => {
        const url = "/availability/business-hours/simple"
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    createBusinessHours: () => {
        const url = '/availability/business-hours'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    createBusinessHours24x7: () => {
        const url = '/availability/business-hours/24x7'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    },

    extendAvailability: (payload: { staffId?: string; daysAhead?: number }) => {
        const url = '/availability/extend-availability'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    initializeBusiness: (payload: { staffIds: string[] }) => {
        const url = '/availability/initialize-business'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    // Platform admin
    setupAvailability: (payload: { businessId: string; staffIds: string[]; startDate: string; endDate: string }) => {
        const url = '/availability/admin/setup'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    checkFullyBooked: (payload: { businessId: string; date: string; startTime: string; duration: number; bufferTime?: number }) => {
        const url = '/availability/admin/check-fully-booked'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    }
}
