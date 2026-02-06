import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import type { UpdateBookingStatusDto } from '~/types/booking'

export const booking_api = {
    createBooking: (payload: any) => {
        const url = '/bookings'
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    getBookings: (params: { status?: string, page?: number, limit?: number } = {}) => {
        const url = "/bookings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    getTodayBookings: () => {
        const url = "/bookings/today/bookings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getPendingBookings: () => {
        const url = "/bookings/pending/bookings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getUpcomingBookings: (days: number = 7) => {
        const url = "/bookings/upcoming/bookings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: { days } })
    },

    getBookingById: (id: string) => {
        const url = `/bookings/${id}`
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    getMyBookings: (status?: string) => {
        const url = '/bookings/my/bookings'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params: status ? { status } : undefined })
    },

    confirmBooking: (id: string, payload: { staffId?: string; staffAssignments?: any[] }) => {
        const url = `/bookings/${id}/confirm`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    processPayment: (id: string, payload: { transactionReference: string; amount: number; paymentMethod: string; gateway: string; clientId: string; businessId: string; paymentType: string }) => {
        const url = `/bookings/${id}/payment`
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    updateStatus: (id: string, payload: UpdateBookingStatusDto) => {
        const url = `/bookings/${id}/status`
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },

    rejectBooking: (id: string, payload: { reason: string }) => {
        const url = `/bookings/${id}/reject`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    cancelBooking: (id: string, payload: { reason: string }) => {
        const url = `/bookings/${id}/cancel`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    rescheduleBooking: (id: string, payload: { newPreferredDate: string; newPreferredStartTime: string; reason: string }) => {
        const url = `/bookings/${id}/reschedule`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    extendBooking: (id: string, payload?: { additionalMinutes?: number }) => {
        const url = `/bookings/${id}/extend`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },

    getStats: (params?: { startDate?: string; endDate?: string }) => {
        const url = "/bookings/stats/overview"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
    },

    resetBookingForRetry: (id: string) => {
        const url = `/bookings/${id}/reset-for-retry`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url)
    }
}
